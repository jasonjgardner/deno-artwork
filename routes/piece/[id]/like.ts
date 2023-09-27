import type { Handlers } from "$fresh/server.ts";
import {
  getArtwork,
  getArtworkReactions,
  removeReaction,
  setReaction,
} from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import type { Artwork, Reaction, ReactionResponse } from "🛠️/types.ts";
import { DEFAULT_REACTION, REACTIONS } from "🛠️/constants.ts";

async function getReactionFromRequest(req: Request): Promise<Reaction> {
  if (req.headers.get("content-type")?.includes("application/json")) {
    const { reaction } = await req.json();
    return reaction;
  }

  const formData = await req.formData();
  const reaction = formData.get("reaction");

  if (reaction === null) {
    return DEFAULT_REACTION;
  }

  return reaction as Reaction;
}

async function getReactionCount(
  artwork: Artwork,
): Promise<Record<Reaction, number>> {
  const entries = await getArtworkReactions(artwork.id);
  const reactions: Record<string, number> = {};

  entries.forEach((entry) => {
    if (reactions[entry.reaction] === undefined) {
      reactions[entry.reaction] = 0;
    }

    reactions[entry.reaction]++;
  });

  return reactions;
}

async function deleteReaction(req: Request, id: string): Promise<Response> {
  const { login } = await getAuthenticatedUser(req) ?? {};

  if (!login) {
    return new Response("Not authenticated", { status: 401 });
  }

  if (!id) {
    return new Response("Invalid artwork", { status: 400 });
  }

  await removeReaction(id, login);

  const res: Omit<ReactionResponse, "details"> = {
    reactions: await getReactionCount(await getArtwork(id) as Artwork),
  };

  return new Response(JSON.stringify(res), { status: 200 });
}

export const handler: Handlers<ReactionResponse> = {
  async GET(_req, { params: { id } }) {
    const artwork = await getArtwork(id) as Artwork;

    return new Response(
      JSON.stringify({
        details: await getArtworkReactions(artwork.id),
        reactions: await getReactionCount(artwork),
      }),
      {
        headers: { "content-type": "application/json" },
        status: 200,
      },
    );
  },
  async DELETE(req, { params: { id } }) {
    return await deleteReaction(req, id);
  },
  async POST(req, { params: { id, _method } }) {
    if (_method === "DELETE") {
      return await deleteReaction(req, id);
    }

    const reaction = await getReactionFromRequest(req);

    if (
      !id || !REACTIONS.includes(reaction)
    ) {
      return new Response("Invalid reaction", { status: 400 });
    }

    const artwork = await getArtwork(id) as Artwork;
    const user = await getAuthenticatedUser(req);

    if (user?.login !== undefined) {
      setReaction(artwork.id, user.login, reaction);
    }

    const reactions = await getArtworkReactions(artwork.id);

    if (req.headers.get("accept")?.includes("text/html")) {
      return new Response(null, {
        headers: {
          location: `/piece/${artwork.id}`,
        },
        status: 302,
      });
    }
    return new Response(JSON.stringify({ reactions }), {
      headers: { "content-type": "application/json" },
      status: 200,
    });
  },
};
