import { useEffect, useState } from "preact/hooks";
import type { Artwork, Reaction } from "🛠️/types.ts";
import { REACTIONS } from "🛠️/constants.ts";

export interface LikeButtonProps {
  artwork: Artwork;
}

const getReactions = async (artwork: Artwork) => {
  const res = await fetch(`/piece/${artwork.id}/like`);
  if (res.status !== 200) {
    throw new Error(`Failed to get reactions for ${artwork.id}`);
  }
  return await res.json();
};

const postReaction = async (artwork: Artwork, reaction: Reaction) => {
  const res = await fetch(`/piece/${artwork.id}/like`, {
    method: "POST",
    body: JSON.stringify({ reaction }),
  });
  if (res.status !== 200) {
    throw new Error(`Failed to react with ${reaction}`);
  }
};

export default function LikeButton({ artwork }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [reactions, setReactions] = useState<Record<Reaction, number>>(
    Object.fromEntries(REACTIONS.map((r) => [r, 0])) as Record<
      Reaction,
      number
    >,
  );

  const handleReaction = (reaction: Reaction): void => {
    postReaction(artwork, reaction);
    setLiked(true);
  };

  useEffect(() => {
    getReactions(artwork).then((res) => {
      setReactions({
        ...reactions,
        ...res.reactions,
      });
    });
  }, [artwork]);

  return (
    <div class="flex items-center justify-start gap-2 ml-1.5">
      {Object.entries(reactions).map(([reaction, count]) => (
        <button
          class="flex items-center justify-center bg(white hover:gray-100) hover:(bg(white))"
          onClick={() => handleReaction(reaction as Reaction)}
          disabled={liked}
          title={reactions[reaction as Reaction]?.toString()}
        >
          {reaction}
          <span class="text(gray-800 sm) font(normal sans) ml-1">
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}
