import { JSX } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import type { Artist, Artwork } from "🛠️/types.ts";
import Item from "📦/Item.tsx";
import { getArtwork } from "🛠️/db.ts";

interface HomeProps {
  artworks: Artwork[];
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const artworks = await getArtwork() as Artwork[];
    return ctx.render({ artworks });
  },
};

export default function Home({ data }: PageProps<HomeProps | null>) {
  if (!data || data.artworks.length === 0) {
    return (
      <div class="mx-4 mt-6">
        <h1 class="text(gray-900 6xl) font(sans bold) cursor-default">
          No artwork found
        </h1>
      </div>
    );
  }

  return (
    <main class="bg-gray-200 p-2 gap-6 grid md:grid-cols-2 2xl:grid-cols-4 place-items-center">
      {data.artworks.map((artwork, idx) => (
        <Item
          key={idx}
          artwork={artwork}
        />
      ))}
    </main>
  );
}
