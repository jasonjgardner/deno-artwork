import type { Reaction, ReactionDetails, ReactionEntry } from "🛠️/types.ts";
import { DEFAULT_AVATARS, REACTIONS } from "🛠️/constants.ts";
export function getRandomAvatar() {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}

/**
 * Create an object with all reactions set to 0
 * @returns Initial reactions object
 */
export function mapInitialReactions() {
  return Object.fromEntries(
    REACTIONS.map((r) => [r, [] as string[]]),
  ) as ReactionDetails;
}

export function buildReactionDetails(
  reactions: ReactionEntry[],
): ReactionDetails {
  return Object.entries(reactions ?? {}).reduce(
    (acc, [, entry]) => {
      const { reaction, user } = entry;
      if (!acc[reaction as Reaction]) {
        acc[reaction as Reaction] = [];
      }

      acc[reaction as Reaction].push(user);
      return acc;
    },
    {} as ReactionDetails,
  );
}
