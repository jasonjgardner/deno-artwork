import { useState } from "preact/hooks";
import IconShare from "$icon/share-3.tsx";
import IconCheck from "$icon/check.tsx";
export interface ShareButtonProps {
  title: string;
  text: string;
  url: URL;
}
export default function ShareButton({ title, text, url }: ShareButtonProps) {
  const [shared, setShared] = useState(false);
  const handleShare = () => {
    navigator
      .share({
        title,
        text,
        url: url.href,
      }).then(() => {
        setShared(true);
      });
  };

  return (
    <div class="flex items-center justify-start gap-2 ml-1.5">
      <button
        class="flex items-center justify-center bg(white hover:gray-100) hover:(bg(white))"
        title="Share"
        onClick={handleShare}
        disabled={!navigator.share}
      >
        <IconShare />
      </button>
      {shared && <IconCheck />}
    </div>
  );
}
