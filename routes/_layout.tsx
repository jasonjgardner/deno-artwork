import { defineLayout } from "$fresh/server.ts";
import { asset } from "$fresh/runtime.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import Session from "📦/User.tsx";

export default defineLayout(async (req, ctx) => {
  const user = await getAuthenticatedUser(req);
  const { pathname } = new URL(req.url);
  const isHome = pathname === "/";

  return (
    <div class="bg-neutral-500 h-screen flex flex-col">
      <header class="bg-black px-4 flex items-center justify-between">
        <h1 class="py-2 font(medium xl) text(white opacity-90) select-none whitespace-nowrap pr-2">
          {isHome ? "🎨 Deno Artwork" : <a href="/">{"← Deno Artwork"}</a>}
        </h1>
        <Session {...{ user }} />
      </header>
      <ctx.Component />
      <footer class="mt-auto">
        <a href="https://fresh.deno.dev" target="_blank" rel="noopener">
          <img
            src={asset("/fresh-badge.svg")}
            alt="Made with Fresh"
            width="197"
            height="37"
          />
        </a>
      </footer>
    </div>
  );
});
