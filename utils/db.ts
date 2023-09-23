import type { Artwork, GitHubUser, Reaction } from "../utils/types.ts";
import { slug } from "slug/mod.ts";

interface ReactionEntry {
  artworkId: Artwork["image"];
  user: GitHubUser["login"];
  reaction: Reaction;
}

interface ArtworkEntry {
  artwork: Artwork;
  reactions: ReactionEntry[];
}

const kv = await Deno.openKv();

export async function setReaction(
  artworkId: Artwork["image"],
  user: GitHubUser["login"],
  reaction: Reaction,
) {
  const res = await kv.set(["reaction", artworkId, user], reaction);

  if (!res.ok) {
    throw new Error("Failed to set reaction");
  }
}

export async function removeReaction(
  artworkId: Artwork["image"],
  user: GitHubUser["login"],
) {
  await kv.delete(["reaction", artworkId, user]);
}

export async function getArtworkReactions(
  artworkId: Artwork["image"],
): Promise<ReactionEntry[]> {
  const records = kv.list<Reaction>({ prefix: ["reaction", artworkId] });
  const reactions = [];
  for await (const res of records) {
    reactions.push({
      artworkId,
      user: res.key[2] as GitHubUser["login"],
      reaction: res.value,
    });
  }

  return reactions;
}

export async function getUserReactions(
  user: GitHubUser["login"],
): Promise<ReactionEntry[]> {
  const records = kv.list<Reaction>({ prefix: ["reaction"] });
  const reactions = [];
  for await (const res of records) {
    if (res.key[2] === user) {
      reactions.push({
        artworkId: res.key[1] as Artwork["image"],
        user,
        reaction: res.value,
      });
    }
  }

  return reactions;
}

export async function getReactions(): Promise<ReactionEntry[]> {
  const records = kv.list<Reaction>({ prefix: ["reaction"] });
  const reactions = [];
  for await (const res of records) {
    reactions.push({
      artworkId: res.key[1] as Artwork["image"],
      user: res.key[2] as GitHubUser["login"],
      reaction: res.value,
    });
  }

  return reactions;
}

export async function loadSavedArtwork(): Promise<Artwork[]> {
  const records = kv.list({ prefix: ["artist"] });
  const artworks = [];
  for await (const res of records) {
    artworks.push(res.value as Artwork);
  }

  return artworks;
}

export function deleteArtwork({ id, artist }: Artwork) {
  kv.delete(["artist", artist.github, id]);
  kv.delete(["artwork", id]);
}

export async function getArtwork(
  id?: Artwork["id"],
): Promise<Artwork[] | Artwork> {
  // const allArtwork = [...loadStaticArtwork(), ...await loadSavedArtwork()];
  const allArtwork = await loadSavedArtwork();

  if (!id) {
    return allArtwork;
  }
  const art = allArtwork.find((a) => a.id === id);

  if (!art) {
    throw new Error(`Artwork not found: ${id}`);
  }

  return art;
}

export async function saveArtwork(artwork: Artwork) {
  const key = [
    "artist",
    artwork.artist.github ?? slug(artwork.artist.name, { lower: true }),
    artwork.id,
  ];

  const artKey = [
    "artwork",
    artwork.id,
  ];

  const res = await kv.set(
    key,
    artwork,
  );

  const artRes = await kv.set(
    artKey,
    artwork,
  );

  if (!res.ok || !artRes.ok) {
    throw new Error(`Failed to save artwork: ${key.join("/")}`);
  }
}

export async function getArtworkByArtist(
  artist: Artwork["artist"]["github"],
): Promise<Artwork[]> {
  const records = kv.list({ prefix: ["artist", artist] });
  const artworks = [];
  for await (const res of records) {
    artworks.push(res.value as Artwork);
  }

  return artworks;
}

export async function sortByReactionCount(): Promise<ArtworkEntry[]> {
  const artworks = await getArtwork() as Artwork[];
  const reactions = await getReactions();
  const reactionCounts = new Map<Artwork["image"], number>();

  for (const reaction of reactions) {
    const count = reactionCounts.get(reaction.artworkId) ?? 0;
    reactionCounts.set(reaction.artworkId, count + 1);
  }

  artworks.sort((a, b) => {
    const aCount = reactionCounts.get(a.image) ?? 0;
    const bCount = reactionCounts.get(b.image) ?? 0;

    return bCount - aCount;
  });

  return artworks.map((artwork) => ({
    artwork,
    reactions: reactions.filter((r) => r.artworkId === artwork.image),
  }));
}
