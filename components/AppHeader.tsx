import StarButton from "📦/StarButton.tsx";
import LoginButton from "📦/LoginButton.tsx";

export interface AppHeaderProps {
  isHome: boolean;
}

export default function AppHeader({ isHome }: AppHeaderProps) {
  return (
    <header class="bg(black opacity-90) backdrop-blur-md px-4 sticky top-0 z-10 shadow-lg">
      <div class="container flex items-center justify-between flex-shrink mx-auto">
        <h1 class="font(sans semibold) text(white opacity-90 2xl) select-none whitespace-nowrap pr-2 leading-loose">
          {isHome
            ? "🎨 Deno Artwork"
            : <a href="/" title="Return to gallery">{"← Deno Artwork"}</a>}
        </h1>
        <StarButton />
        <LoginButton />
      </div>
    </header>
  );
}
