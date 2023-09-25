import { useEffect, useState } from "preact/hooks";
import type {
  Artwork,
  GitHubUser,
  Reaction,
  ReactionEntry,
  Reactions,
} from "🛠️/types.ts";
import { REACTIONS } from "🛠️/constants.ts";

export interface LikeButtonProps {
  artwork: Artwork;
}

type ReactionDetails = Record<Reaction, Array<GitHubUser["login"]>>;

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

export default function LikeButton({ artwork }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [reactions, setReactions] = useState<Reactions>(
    artwork.reactions ??
      Object.fromEntries(REACTIONS.map((r) => [r, 0])) as Reactions,
  );
  const [reactionDetails, setReactionDetails] = useState<ReactionDetails>(
    Object.fromEntries(
      REACTIONS.map((r) => [r as Reaction, [] as GitHubUser["login"][]]),
    ) as ReactionDetails,
  );

  const handleReaction = (reaction: Reaction): void => {
    setLiked(true);
    postReaction(artwork, reaction).then((res) => {
      if (reactionDetails[reaction] === undefined) {
        reactionDetails[reaction] = [];
      }

      reactionDetails[reaction] = [...reactionDetails[reaction], res.user];
      setReactionDetails({ ...reactionDetails });
    });
  };

  useEffect(() => {
    getReactions(artwork).then((res) => {
      setReactions({
        ...reactions,
        ...res.reactions,
      });

      const details = Object.fromEntries(
        res.details.map((detail) => [detail.reaction, [...[detail.user]]]),
      ) as ReactionDetails;

      setReactionDetails(details);
    });
  }, [liked]);

  return (
    <div class="flex items-center justify-between w-full divide-x border-gray-200">
      {Object.entries(reactions).map(([reaction, count]) => (
        <div class="flex-1 flex justify-center">
          <button
            class="group~btn flex(row nowrap) items-center text-sm border(blue-100) rounded-md px-2 bg(white hover:gray-100) hover:(bg(white)) py-2"
            onClick={() => handleReaction(reaction as Reaction)}
            disabled={liked}
            title={(reactionDetails[reaction as Reaction] ?? []).join("\r\n") ??
              `${count} ${reaction}s`}
          >
            {reaction}
            <span class="text(gray-800 xs) font(normal sans) ml-1 group~btn:hover(text-blue-900)">
              {count}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
