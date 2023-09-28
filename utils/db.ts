import type {
  AdminLogin,
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

/**
 * Remove the user's reaction to the artwork from KV storage
 * @param artworkId Artwork ID
 * @param user User's GitHub login
 * @param reaction Optional specific reaction to remove
 * @returns void
 * @example
 * ```ts
 * removeReaction(artwork.id, user.login);
 * removeReaction(artwork.id, user.login, "🍕" as Reaction);
 * ```
 */
export async function removeReaction(
  artworkId: Artwork["id"],
  user: GitHubUser["login"],
  reaction?: Reaction,
) {
  const key = ["reaction", artworkId, user];

  if (
    reaction !== undefined &&
    ((await kv.get<Reaction>(key)).value === reaction)
  ) {
    return;
  }

  await kv.delete(key);
}

/**
 * Get all reactions for a specific artwork
 * @param artworkId Artwork ID
 * @returns List of reaction entries for the artwork
 * @example
 * ```ts
 * const reactions = await getArtworkReactions(artwork.id);
 * ```
 */
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

/**
 * Get all reactions from a specific user
 * @param user User's GitHub login
 * @returns List of reaction entries for the user
 * @example
 * ```ts
 * const reactions = await getUserReactions(user.login);
 * ```
 */
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

/**
 * Get all saved artwork from KV storage
 * @uses {@link kvArray}
 * @returns List of all saved artwork
 * @example
 * ```ts
 * const artwork = await loadSavedArtwork();
 * ```
 */
export async function loadSavedArtwork(): Promise<Artwork[]> {
  return await kvArray({ prefix: ["artist"] });
}

/**
 * Delete artwork from KV storage.
 * Logs an error if the artwork could not be deleted.
 * @param artwork Artwork to delete
 * @returns void
 * @example
 * ```ts
 * deleteArtwork(artwork);
 * ```
 */
export async function deleteArtwork({ id, artist }: Artwork) {
  try {
    await kv.delete(["artist", artist.id ?? artist.github, id]);
    await kv.delete(["artwork", id]);
  } catch (err) {
    console.error(`Failed to delete artwork ${id}: %s`, err);
  }
}

/**
 * Get artwork from KV storage.
 * If an ID is provided, returns a single artwork.
 * Otherwise, returns all artwork.
 * @param id Optional artwork ID to get
 * @returns List of all saved artwork or a single artwork if an ID is provided
 * @throws Error if an ID is provided and the artwork could not be found
 * @example
 * ```ts
 * const artwork = await getArtwork();
 * const artwork = await getArtwork(artwork.id);
 * ```
 */
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

/**
 * Save artwork to KV storage. Uses artist ID, GitHub username, or slugified name (in that order of availability) as the key.
 * @param artwork Artwork to save
 * @returns Promise containing the key for the saved artwork
 * @throws Error if the artwork could not be saved
 * @example
 * ```ts
 * const [_namespace, artistId, artworkId] = await saveArtwork(artwork);
 * ```
 */
export async function saveArtwork(artwork: Artwork): Promise<string[]> {
  const key = [
    "artist",
    artwork.artist.id ?? artwork.artist.github ??
      slug(artwork.artist.name, { lower: true }),
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

/**
 * Get artwork by artist ID.
 * @uses {@link kvArray}
 * @param artist Artist to get artwork for
 * @returns List of artwork for the artist
 * @example
 * ```ts
 * const artwork = await getArtworkByArtist("jasonjgardner");
 * ```
 */
export async function getArtworkByArtist(
  artist: Artwork["artist"]["id"],
): Promise<Artwork[]> {
  return await kvArray<Artwork>({ prefix: ["artist", artist] });
}

/**
 * Return all artwork with reactions
 * @returns Array of artwork with reactions to the artworks
 */
export async function getArtworkEntries(): Promise<ArtworkEntry[]> {
  const artworks = await loadSavedArtwork();
  const reactions = await getReactions() as ReactionEntry[];

  return artworks.map((artwork) => ({
    artwork,
    reactions: reactions.filter(({ artworkId }) => artworkId === artwork.id),
  }));
}

/**
 * Return all artwork with reactions, sorted by reaction count
 * @uses {@link getReactions}
 * @param artworks Array of artwork to sort
 * @returns Array of artwork with reactions to the artworks, sorted by reaction count
 */
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

/**
 * Tracks when a user last signed in and returns the last login date
 * @returns Last login date as an ISO string
 */
export async function logUserSignIn({ id, login }: GitHubUser) {
  const key = [
    "user",
    login,
  ];

  const existing = await kv.get<AdminLogin>(key);

  const newValue = {
    user: {
      id,
      login,
    },
    lastLogin: new Date().toISOString(),
  };

  const res = await kv.set(
    key,
    newValue,
  );

  if (!res.ok) {
    throw new Error(`Failed to log user: ${key.join("/")}`);
  }

  return existing?.value?.lastLogin ?? newValue.lastLogin;
}
