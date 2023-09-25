import { asset } from "$fresh/runtime.ts";
import { GitHubIcon } from "📦/icon/mod.ts";
export default function AppFooter() {
  return (
    <footer class="mt-auto bg-black text(white sm) font(sans medium)">
      <div class="container flex items-center justify-between py-2 px-4 mx-auto">
        <a
          href="https://github.com/jasonjgardner/deno-artwork"
          class="text(underline hover:(no-underline)) inline-flex items-center gap-1"
          target="_blank"
          rel="noopener"
        >
          <GitHubIcon />
          Contribute on GitHub
        </a>

        <a
          href="https://fresh.deno.dev"
          target="_blank"
          rel="noopener"
        >
          <img
            src={asset("/fresh-badge.svg")}
            alt="Made with Fresh"
            width="197"
            height="37"
          />
        </a>
      </div>
    </footer>
  );
}
