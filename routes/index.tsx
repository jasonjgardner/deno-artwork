import { Handlers, PageProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";
import type { Artwork, ArtworkEntry, GitHubUser } from "🛠️/types.ts";
import { getArtwork, getArtworkEntries, sortByReactionCount } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import Gallery from "🏝️/Gallery.tsx";

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
      <>
        <Head>
          <title>Deno Artwork</title>
        </Head>
        <div class="mx-4 mt-6">
          <h1 class="text(gray-900 6xl) font(sans bold) cursor-default">
            No artwork found
          </h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Deno Artwork</title>
        <meta
          name="description"
          content="Artwork gallery inspired/powered by Deno."
        />
        <meta property="og:title" content="Deno Artwork" />
        <meta
          property="og:description"
          content="Open-source artwork gallery inspired/powered by Deno."
        />
        <meta
          property="og:image"
          content={asset("/images/og.png")}
        />
        <meta
          property="og:url"
          content="https://artwork.deno.dev"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Deno Artwork" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main class="bg-gray-200 px-2 py-2 pb-6">
        <div class="container mx-auto">
          <h2 class="text(xl gray-800 center md:left) font(sans medium) leading-loose mt-4">
            Do you have a piece to display here?{" "}
            <a
              href="https://github.com/jasonjgardner/deno-artwork/edit/main/data/artwork.json"
              class="text(blue-500 underline hover:(no-underline blue-600))"
              target="_blank"
              rel="noopener noreferrer"
            >
              Add it!
            </a>
          </h2>
          <div class="gap-6 grid md:grid-cols-2 2xl:grid-cols-4 place-items-center mt-6">
            <Gallery artworks={data.artworks} user={data.user} />
          </div>
        </div>
      </main>
    </>
  );
}
