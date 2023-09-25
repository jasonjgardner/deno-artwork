import { Handlers, PageProps } from "$fresh/server.ts";
import type { Artist, Artwork, ArtworkEntry, Reactions } from "🛠️/types.ts";
import Item from "📦/Item.tsx";
import { getArtwork, sortByReactionCount } from "🛠️/db.ts";

interface HomeProps {
  artworks: ArtworkEntry[];
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const { searchParams } = url;
    const { sort } = Object.fromEntries(searchParams.entries());

    const artworks = await getArtwork() as Artwork[];

    if (sort === "popularity") {
      return ctx.render({ artworks: await sortByReactionCount(artworks) });
    }

    return ctx.render({
      artworks: artworks.map((artwork) => ({ artwork, reactions: [] })),
    });
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
    <main class="bg-gray-200 px-2 py-2 pb-6">
      <div class="container mx-auto">
        <h2 class="text(xl gray-800) font(sans medium) leading-loose mt-4">
          Do you have a piece to display here?{" "}
          <a
            href="/piece/submit"
            class="text(blue-500 underline hover:(no-underline))"
          >
            Add it!
          </a>
        </h2>
        <div class="gap-6 grid md:grid-cols-2 2xl:grid-cols-4 place-items-center mt-6">
          {data.artworks.map((entry, idx) => (
            <Item
              key={`${entry.artwork.id}${idx}`}
              artwork={entry.artwork}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
