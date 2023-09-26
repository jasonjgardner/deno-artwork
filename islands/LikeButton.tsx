import { type Signal, signal } from "@preact/signals";
import { useState } from "preact/hooks";
import { cx } from "@twind/core";
import { useContext } from "preact/hooks";
import type {
  Artwork,
  ArtworkEntry,
  Reaction,
  ReactionDetails,
  ReactionEntry,
  Reactions,
} from "🛠️/types.ts";
import { UserContext } from "🛠️/user.ts";
import { buildReactionDetails, mapInitialReactions } from "🛠️/mod.ts";
import UserList from "🏝️/UserList.tsx";

const getReactions = async (artwork: Artwork): Promise<{
  reactions: Reactions;
  details: ReactionEntry[];
}> => {
  const res = await fetch(`/piece/${artwork.id}/like`);
  if (res.status !== 200) {
    throw new Error(`Failed to get reactions for ${artwork.id}`);
  }
  return await res.json();
};

const postReaction = async (
  artwork: Artwork,
  reaction: Reaction,
): Promise<ReactionEntry> => {
  const res = await fetch(`/piece/${artwork.id}/like`, {
    method: "POST",
    body: JSON.stringify({ reaction }),
  });
  if (res.status !== 200) {
    throw new Error(`Failed to react with ${reaction}`);
  }

  return await res.json();
};

export default function LikeButton({ entry }: { entry: ArtworkEntry }) {
  const user = useContext(UserContext);

  const { artwork, reactions } = entry;
  const allReactions: Signal<ReactionDetails> = signal({
    ...mapInitialReactions(),
    ...buildReactionDetails(reactions),
  });

  const allReactionsLength = Object.keys(allReactions).length;

  const [reactionDetails, setReactionDetails] = useState<ReactionDetails>(
    allReactions.value,
  );

  const handleReaction = (reaction: Reaction): void => {
    if (!user) {
      return;
    }
    postReaction(artwork, reaction).then(() => {
      allReactions.value[reaction].push(user.login);
      allReactions.value = { ...allReactions.value };
      setReactionDetails(allReactions.value);
    });
  };

  return (
    <div class="flex items-center justify-between w-full divide-x border-gray-200">
      {Object.entries(reactionDetails).map(([reaction, users], idx) => {
        const count = users.length;
        return (
          <div
            class={cx(
              "group-btn flex-1 flex justify-center items-stretch",
              count && "relative",
              users.includes(user?.login ?? "")
                ? "bg(gray-100 hover:(gray-200)) border-t border-t-gray-300 -mt-px"
                : "bg(white hover:(gray-50))",
            )}
          >
            <button
              class={cx(
                "flex(row nowrap) items-center p-2 text(base center) font(sans medium) w-full",
                "siblings:(opacity-0 group-btn-hover:(opacity-100 -translate-y-1) translate-y-full transition-[opacity,transform] delay-100 duration-200 ease-out)",
                "disabled:(opacity-50 cursor-default)",
              )}
              onClick={() => handleReaction(reaction as Reaction)}
              type="button"
            >
              {reaction}

              <span class="text(gray-800 xs group-btn-hover:(blue-500)) font(normal sans) ml-1">
                {count}
              </span>
            </button>
            {count > 0 && (
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
    </div>
  );
}
