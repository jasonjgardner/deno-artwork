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
    <div class="flex items-center justify-end px-2 gap-2 w-full">
      <button
        class="flex items-center justify-between gap-2 text(md gray-700) font(sans semibold) bg(white hover:gray-100) hover:(bg(white) text(gray-900 underline)) select-none"
        title="Share"
        onClick={handleShare}
        disabled={!navigator.share}
      >
        <IconShare />
        Share
      </button>
      {shared && <IconCheck />}
    </div>
  );
}
