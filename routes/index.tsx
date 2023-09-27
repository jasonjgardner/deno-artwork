import { Handlers, PageProps } from "$fresh/server.ts";
import type { Artwork, ArtworkEntry, GitHubUser } from "🛠️/types.ts";
import Gallery from "🏝️/Gallery.tsx";
import { getArtwork, getArtworkEntries, sortByReactionCount } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";

interface HomeProps {
  artworks: ArtworkEntry[];
  user: GitHubUser | null;
}

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const user = await getAuthenticatedUser(req);
    const url = new URL(req.url);
    const { searchParams } = url;
    const { sort } = Object.fromEntries(searchParams.entries());

    const res = {
      user,
      artworks: [] as ArtworkEntry[],
    };

    if (!sort) {
      res.artworks = await getArtworkEntries();
      return ctx.render(res);
    }

    res.artworks = await sortByReactionCount(await getArtwork() as Artwork[]);

    return ctx.render(res);
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
          <Gallery artworks={data.artworks} user={data.user} />
        </div>
      </div>
    </main>
  );
}
