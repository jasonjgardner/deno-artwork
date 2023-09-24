import Session from "📦/User.tsx";
import { GitHubUser } from "🛠️/types.ts";

export interface AppHeaderProps {
  user: GitHubUser | null;
  isHome: boolean;
}

export default function AppHeader({ user, isHome }: AppHeaderProps) {
  return (
    <header class="bg(black opacity-90) backdrop-blur-md px-4 flex items-center justify-between flex-shrink sticky top-0 z-10 shadow-lg">
      <h1 class="font(sans semibold) text(white opacity-90 2xl) select-none whitespace-nowrap pr-2 leading-loose">
        {isHome ? "🎨 Deno Artwork" : <a href="/">{"← Deno Artwork"}</a>}
      </h1>
      {user ? <Session {...{ user }} /> : (
        <a
          href="/oauth/signin"
          class="text(white opacity-90 sm) font(medium)"
        >
          Sign in with GitHub
        </a>
      )}
    </header>
  );
}
