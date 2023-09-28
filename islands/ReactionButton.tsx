import type { JSX } from "preact";
import { type Signal, useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { cx } from "@twind/core";
import { useContext } from "preact/hooks";
import type {
  Artwork,
  ArtworkEntry,
  GitHubUser,
  Reaction,
  ReactionDetails,
  ReactionEntry,
  ReactionResponse,
  Reactions,
} from "🛠️/types.ts";
import { UserContext } from "🛠️/user.ts";
import { buildReactionDetails, mapInitialReactions } from "🛠️/mod.ts";
import UserList from "🏝️/UserList.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface ReactionButtonProps {
  entry: ArtworkEntry;
  showUsers?: boolean;
  user: GitHubUser | null;
}

type ReactionEntryList = Array<
  [Reaction, GitHubUser["login"][]]
>;

/**
 * Get the reactions for a piece of artwork
 * @param artwork - Artwork to get reactions for
 * @returns List of reactions
 * @throws Error if request fails
 */
const getReactions = async (artwork: Artwork): Promise<ReactionResponse> => {
  const res = await fetch(`/piece/${artwork.id}/like`);

  if (res.status !== 200) {
    throw new Error(`Failed to get reactions for ${artwork.id}`);
  }

  return await res.json();
};

/**
 * Remove the user's reaction from a piece of artwork
 * @param artwork - Artwork to remove reaction from
 * @param reaction - Reaction to remove
 * @returns List of reactions after removal
 */
const removeReaction = async (
  artwork: Artwork,
  reaction: Reaction,
): Promise<ReactionResponse> => {
  const res = await fetch(`/piece/${artwork.id}/like`, {
    method: "DELETE",
    body: JSON.stringify({ reaction }),
  });
  if (res.status !== 200) {
    throw new Error(`Failed to remove reaction ${reaction}`);
  }

  return await getReactions(artwork);
};

/**
 * Post a reaction to a piece of artwork
 * @param artwork - Artwork to react to
 * @param reaction - Reaction to post
 * @returns Response from server with updated reactions
 * @throws Error if request fails
 */
const postReaction = async (
  artwork: Artwork,
  reaction: Reaction,
): Promise<{ reactions: ReactionEntry[] }> => {
  if (!IS_BROWSER) {
    throw new Error("Cannot post reaction on server");
  }

  const res = await fetch(`/piece/${artwork.id}/like`, {
    method: "POST",
    body: JSON.stringify({ reaction }),
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (res.status !== 200) {
    throw new Error(`Failed to react with ${reaction}`);
  }

  return await res.json();
};

/**
 * Form component for posting reactions to a piece of artwork
 * @returns Social reaction buttons
 */
export default function ReactionButton(
  { entry, showUsers, user }: ReactionButtonProps,
) {
  const { artwork, reactions } = entry;

  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * All reactions. Includes reactions with and without users.
   */
  const allReactions: Signal<ReactionDetails> = useSignal({
    ...mapInitialReactions(),
    ...buildReactionDetails(reactions),
  });

  /**
   * Number of different reactions.
   * Used to determine if a reaction is the last one.
   */
  const allReactionsLength = Object.keys(allReactions).length;

  /**
   * Reaction the user has posted, if any
   */
  const userLiked: Signal<Reaction | null> = useSignal(
    reactions.find((r) => r.user === user?.login)?.reaction ?? null,
  );

  /**
   * List of reactions and users who posted them
   */
  const entries = useSignal(Object.entries(allReactions.value) as Array<
    [Reaction, GitHubUser["login"][]]
  >);

  /**
   * Like or unlike a piece of artwork through API
   * @param reaction - Reaction to post
   */
  const handleReaction = (reaction: Reaction): void => {
    if (!user) {
      setErrorMessage("You must be logged in to post reaction");
      return;
    }

    setErrorMessage("");

    if (userLiked.value) {
      // Remove user from list of reactions for their existing reaction
      allReactions.value[userLiked.value] = allReactions.value[userLiked.value]
        .filter(
          (
            u,
          ) => u !== user?.login,
        );

      // "Unlike"
      // TODO: Consider using buttons instead of radio inputs to allow unchecking.
      // Current unliking process is finicky.
      if (userLiked.value === reaction) {
        userLiked.value = null;

        removeReaction(artwork, reaction).then(() => {
          entries.value = Object.entries(
            allReactions.value,
          ) as ReactionEntryList;
        }).catch((err) => {
          setErrorMessage(err.message);
        });
        return;
      }
    }

    // "Like"
    userLiked.value = reaction;

    postReaction(artwork, reaction).then((res) => {
      allReactions.value = {
        ...allReactions.value,
        ...buildReactionDetails(res.reactions),
      };

      entries.value = Object.entries(allReactions.value) as ReactionEntryList;
    }).catch((err) => {
      setErrorMessage(err.message);
    });
  };

  return (
    <>
      {errorMessage && (
        <p class="text(red-500 xs) font(sans medium) text-center">
          {errorMessage}
        </p>
      )}
      <form
        class="flex items-center justify-between w-full divide-x border-gray-200"
        action={`/piece/${artwork.id}/like`}
        method="post"
        onChange={(e) =>
          IS_BROWSER &&
          handleReaction((e.target as HTMLInputElement).value as Reaction)}
      >
        {entries.value.map(([reaction, users], idx) => {
          const count = users.length;
          return (
            <div
              key={reaction}
              class={cx(
                "group-btn flex-1 flex justify-center items-stretch",
                showUsers && count && "relative",
                users.includes(user?.login ?? "")
                  ? "bg(gray-100 hover:(gray-200)) border-t border-t-gray-300 -mt-px"
                  : "bg(white hover:(gray-50))",
              )}
            >
              <label
                class={cx(
                  "cursor-pointer select-none",
                  "disabled:(opacity-75 cursor-default)",
                  "flex(row nowrap) items-stretch justify-between text(base center) font(sans medium) w-full whitespace-nowrap",
                  // Style user list
                  showUsers &&
                    "siblings:(opacity-0 group-btn-hover:(opacity-100 -translate-y-1) translate-y-full transition-[opacity,transform] delay-100 duration-200 ease-out)",
                )}
                disabled={!user}
              >
                <input
                  type="radio"
                  value={reaction}
                  name="reaction"
                  class="hidden
                    checked:siblings:(font-semibold text(pink-500) bg-gray-100 border-t border-t-gray-300 -mt-px)))"
                />
                <span class="flex items-center justify-center py-2 pl-1">
                  {reaction}
                  <span class="text(gray-800 xs group-btn-hover:(blue-500)) font(normal sans) ml-1 pr-1">
                    {count}
                  </span>
                </span>
              </label>
              {showUsers && count > 0 && (
                <UserList
                  class={cx(
                    idx === 0 && "left-0 translate-x-1",
                    idx === allReactionsLength - 1 && "right-0 -translate-x-1",
                  )}
                  {...{ users, user }}
                />
              )}
            </div>
          );
        })}
      </form>
    </>
  );
}
