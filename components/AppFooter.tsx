import { asset } from "$fresh/runtime.ts";
import { GitHubIcon } from "📦/icon/mod.ts";
import { REPO_URL } from "🛠️/constants.ts";
export default function AppFooter() {
  return (
    <footer class="mt-auto bg-black text(white sm) font(sans medium)">
      <div class="container p-4 mx-auto flex flex(row reverse wrap) items-center justify-between gap-4">
        <a
          href="https://fresh.deno.dev"
          class="min-w-[197px]"
          target="_blank"
          rel="noopener"
        >
          <img
            src={asset("/fresh-badge-dark.svg")}
            alt="Made with Fresh"
            width="197"
            height="37"
          />
        </a>

        <a
          href={`${REPO_URL}?tab=MIT-1-ov-file`}
          class="font(sm medium) text(gray-100 hover:(gray-50 underline)) no-underline whitespace-nowrap"
        >
          License (MIT)
        </a>

        <a
          href={REPO_URL}
          class="font(sm normal) text(underline hover:(no-underline)) inline-flex items-center gap-1 whitespace-nowrap pl-4"
          target="_blank"
          rel="noopener"
        >
          <GitHubIcon />
          Contribute on GitHub
        </a>
      </div>
    </footer>
  );
}
