import { useContext } from "preact/hooks";
import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { BrowserIcon, GitHubIcon, InstagramIcon, XIcon } from "📦/icon/mod.ts";
import type { Artist as IArtist, ArtworkEntry } from "🛠️/types.ts";
import { getArtworkByArtist, sortByReactionCount } from "🛠️/db.ts";
import { UserContext } from "🛠️/user.ts";
import { getRandomAvatar } from "🛠️/mod.ts";
import Gallery from "🏝️/Gallery.tsx";

interface Data {
  artist: IArtist;
  artworks: ArtworkEntry[];
}

export const handler: Handlers<Data | null> = {
  async GET(_req, ctx) {
    const { username } = ctx.params;
    if (!username) {
      return ctx.renderNotFound();
    }

    const artworks = await sortByReactionCount(
      await getArtworkByArtist(username),
    );

    if (artworks.length === 0) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      artist: artworks[0].artwork.artist,
      artworks,
    });
  },
};

function writeMetaDescription(
  artist: IArtist,
  artworks: ArtworkEntry[],
): string {
  let metaDescription = `Gallery of Deno artwork created by ${artist.name}.`;

  if (artworks.length === 1) {
    const artworkYear = new Date(artworks[0].artwork.date).getFullYear();
    return `${metaDescription}\r\nIncludes the fine art piece: "${
      artworks[0].artwork.title
    }" (${artworkYear}).`;
  }

  if (artworks.length > 1) {
    metaDescription += "Includes fine art pieces such as ";

    artworks.forEach((artwork, i) => {
      if (i === artworks.length - 1) {
        metaDescription += `and "${artwork.artwork.title}".`;
        return;
      }

      metaDescription += `"${artwork.artwork.title}", `;
    });
  }

  return metaDescription;
}

export default function Artist({ data }: PageProps<Data | null>) {
  const user = useContext(UserContext);
  const { artist, artworks } = data ?? { artist: null, artworks: [] };

  if (!artist) {
    return (
      <div class="mx-4 mt-6">
        <h1 class="text(gray-900 6xl) font(sans bold) cursor-default">
          Artist not found
        </h1>
      </div>
    );
  }

  const metaDescription = writeMetaDescription(artist, artworks);
  const shareUrl = new URL(`/artist/${artist.github}`, import.meta.url);

  return (
    <>
      <Head>
        <title>Deno Artwork by {artist.name}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={`Deno Artwork by ${artist.name}`} />
        <meta property="og:description" content={metaDescription} />
        <meta
          property="og:image"
          content={artist.profile_image ?? artworks[0].artwork.image}
        />
        <meta
          property="og:url"
          content={shareUrl.href}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Deno Artwork" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div class="container p-2 mx-auto flex flex-col gap-y-4">
        <div class="flex justify-start items-start">
          <img
            src={artist?.profile_image ?? getRandomAvatar()}
            alt={artist.name}
            class="rounded-md w-24 h-24 border(gray-500 opacity-50) shadow-sm"
            height="32"
            width="32"
          />

          <div class="ml-4 flex flex-col justify-center mt-auto mb-2 gap-1">
            <div class="text-4xl leading-tight">
              {artist.web
                ? (
                  <a
                    class="text(underline gray-900) hover:(no-underline)"
                    href={artist.web}
                    rel="noopener"
                    target="_blank"
                  >
                    {artist.name}
                  </a>
                )
                : artist.name}
            </div>

            <nav class="flex justify-start items-center gap-2 children:(text-gray-500 hover:text-gray-700 h-5 w-auto)">
              {artist.web && (
                <a
                  href={artist.web}
                  rel="noopener"
                  title="Website"
                  target="_blank"
                >
                  <BrowserIcon />
                </a>
              )}

              {artist.github && (
                <a
                  href={`https://github.com/${artist.github}`}
                  rel="noreferer noopener"
                  title="GitHub"
                  target="_blank"
                >
                  <GitHubIcon />
                </a>
              )}

              {artist.instagram && (
                <a
                  href={`https://www.instagram.com/${artist.instagram}`}
                  rel="noreferer noopener"
                  target="_blank"
                >
                  <InstagramIcon />
                </a>
              )}

              {artist.twitter && (
                <a
                  href={`https://twitter.com/${artist.twitter}`}
                  rel="noreferer noopener"
                  title="Twitter"
                  target="_blank"
                >
                  <XIcon />
                </a>
              )}
            </nav>
          </div>
        </div>
        <div class="w-full grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center">
          <Gallery {...{ user, artworks }} />
        </div>
      </div>
    </>
  );
}
