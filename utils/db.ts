import type {
  Artwork,
  ArtworkEntry,
  GitHubUser,
  Reaction,
  ReactionEntry,
} from "🛠️/types.ts";
import { slug } from "slug/mod.ts";

const kv = await Deno.openKv();

/**
 * Helper function to convert Deno KV list selector to an array
 * @param selector Deno KV selector
 * @returns Promise containing KV records as an array
 */
export async function kvArray<T>(selector: Deno.KvListSelector): Promise<T[]> {
  const records = kv.list<T>(selector);
  const items = [];
  for await (const res of records) {
    items.push(res.value);
  }

  return items;
}

/**
 * Save the user's reaction to the artwork
 * @param artworkId Artwork ID
 * @param user User's GitHub login
 * @param reaction Reaction to save
 * @returns Promise containing the versionstamp of the saved reaction
 * @throws Error if the reaction could not be saved
 * @example
 * ```ts
 * setReaction(artwork.id, user.login, "👍" as Reaction);
 * ```
 */
export async function setReaction(
  artworkId: Artwork["id"],
  user: GitHubUser["login"],
  reaction: Reaction,
) {
  const res = await kv.set(["reaction", artworkId, user], reaction);

  if (!res.ok) {
    throw new Error("Failed to set reaction");
  }
}

export async function removeReaction(
  artworkId: Artwork["id"],
  user: GitHubUser["login"],
) {
  await kv.delete(["reaction", artworkId, user]);
}

export async function getArtworkReactions(
  artworkId: Artwork["id"],
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
        artworkId: res.key[1] as Artwork["id"],
        user,
        reaction: res.value,
      });
    }
  }

  return reactions;
}

/**
 * Get all reactions or reactions for a specific artwork
 * @param id Optional artwork ID to get reactions for
 * @returns List of reactions or a single reaction if an ID is provided
 * @example
 * ```ts
 * const reactions = await getReactions();
 * const reactionsForArtwork = await getReactions(artwork.id);
 * ```
 */
export async function getReactions(
  id?: Artwork["id"],
): Promise<ReactionEntry[] | ReactionEntry> {
  const prefix = id ? ["reaction", id] : ["reaction"];
  const records = kv.list<Reaction>({ prefix });
  const reactions = [];
  for await (const res of records) {
    reactions.push({
      artworkId: res.key[1] as Artwork["id"],
      user: res.key[2] as GitHubUser["login"],
      reaction: res.value,
    });
  }

  return id ? reactions[0] : reactions;
}

export async function loadSavedArtwork(): Promise<Artwork[]> {
  return await kvArray({ prefix: ["artist"] });
}

export function deleteArtwork({ id, artist }: Artwork) {
  kv.delete(["artist", artist.github, id]);
  kv.delete(["artwork", id]);
}

export async function getArtwork(
  id?: Artwork["id"],
): Promise<Artwork[] | Artwork> {
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

export async function saveArtwork(artwork: Artwork): Promise<string[]> {
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

  return key;
}

export async function getArtworkByArtist(
  artist: Artwork["artist"]["github"],
): Promise<Artwork[]> {
  return await kvArray<Artwork>({ prefix: ["artist", artist] });
}

export async function getArtworkEntries(): Promise<ArtworkEntry[]> {
  const artworks = await loadSavedArtwork();
  const reactions = await getReactions() as ReactionEntry[];

  return artworks.map((artwork) => ({
    artwork,
    reactions: reactions.filter(({ artworkId }) => artworkId === artwork.id),
  }));
}

export async function sortByReactionCount(
  artworks: Artwork[],
): Promise<ArtworkEntry[]> {
  const reactions = await getReactions() as ReactionEntry[];
  const reactionCounts = new Map<Artwork["id"], number>();

  for (const reaction of reactions) {
    const { artworkId } = reactions.find((r) =>
      r.artworkId === reaction.artworkId
    ) ?? {};

    if (!artworkId) {
      continue;
    }

    const count = reactionCounts.get(artworkId) ?? 0;
    reactionCounts.set(reaction.artworkId, count + 1);
  }

  artworks.sort((a, b) => {
    const aCount = reactionCounts.get(a.id) ?? 0;
    const bCount = reactionCounts.get(b.id) ?? 0;

    return bCount - aCount;
  });

  return artworks.map((artwork) => ({
    artwork,
    reactions: reactions.filter((r) => r.artworkId === artwork.id),
  }));
}

export async function logUserSignIn(user: GitHubUser) {
  const key = [
    "user",
    user.login,
  ];

  const res = await kv.set(
    key,
    [user.id, user.login],
    {
      expireIn: 60 * 60 * 24,
    },
  );

  if (!res.ok) {
    throw new Error(`Failed to log user: ${key.join("/")}`);
  }

  return (await kv.get<[string, string]>(key)).versionstamp;
}
