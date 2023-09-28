import { StarIcon } from "📦/icon/mod.ts";
import { REPO_URL } from "🛠️/constants.ts";

export default function StarButton() {
  return (
    <a
      href={REPO_URL}
      class="px-2 py-1 bg(gray-200) rounded border(gray-100 1) outline(gray-800 1) hover:(bg-gray-200 text-gray-900) hidden sm:flex items-center justify-start gap-1 shadow-sm font(semibold sans) text(gray-800 xs center) leading-none whitespace-nowrap ml-auto mr-4"
      role="button"
      target="_blank"
      rel="noopener noreferrer"
      title="Star Deno Artwork on GitHub"
    >
      <StarIcon class="w-4 h-4 -mt-px" /> Star
    </a>
  );
}
