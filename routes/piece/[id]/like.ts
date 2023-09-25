import { HandlerContext } from "$fresh/server.ts";
import { getArtwork, getArtworkReactions, setReaction } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import type { Artwork, Reaction } from "🛠️/types.ts";
import { REACTIONS } from "🛠️/constants.ts";

async function getReactionCount(
  artwork: Artwork,
): Promise<Record<string, number>> {
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

export const handler = async (
  req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const { id } = ctx.params;

  if (id === undefined) {
    return new Response("Missing artwork id", { status: 400 });
  }

  if (req.method === "GET") {
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
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { reaction } = await req.json();
  if (
    !id || !REACTIONS.includes(reaction as Reaction)
  ) {
    return new Response("Invalid reaction", { status: 400 });
  }
  const artwork = await getArtwork(id) as Artwork;
  const user = await getAuthenticatedUser(req);

  if (user?.login !== undefined) {
    setReaction(artwork.id, user.login, (reaction ?? "👍") as Reaction);
  }

  const reactions = await getArtworkReactions(artwork.id);

  return new Response(JSON.stringify({ reactions }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
};
