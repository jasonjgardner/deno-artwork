import { Handlers, PageProps } from "$fresh/server.ts";
import { BrowserIcon, GitHubIcon, InstagramIcon, XIcon } from "📦/icon/mod.ts";
import type { Artist as IArtist, Artwork } from "🛠️/types.ts";
import { getArtworkByArtist } from "🛠️/db.ts";
import { getRandomAvatar } from "🛠️/mod.ts";
import Item from "📦/Item.tsx";

interface Data {
  artist: IArtist;
  artworks: Artwork[];
}

export const handler: Handlers<Data | null> = {
  async GET(req, ctx) {
    const { username } = ctx.params;
    if (!username) {
      return ctx.render(null);
    }

    const artworks = await getArtworkByArtist(username);

    if (artworks.length === 0) {
      return ctx.render(null);
    }

    return ctx.render({
      artist: artworks[0].artist,
      artworks,
    });
  },
};

export default function Artist({ params, data }: PageProps<Data | null>) {
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

  return (
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
        {data?.artworks.map((artwork) => (
          <Item
            key={artwork.id}
            artwork={artwork}
          />
        ))}
      </div>
    </div>
  );
}
