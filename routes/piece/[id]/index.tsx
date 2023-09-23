import { Handlers, PageProps } from "$fresh/server.ts";
import type { Artwork } from "🛠️/types.ts";
import { getArtwork } from "🛠️/db.ts";
import { slug } from "slug/mod.ts";
import { DEFAULT_AVATAR } from "🛠️/constants.ts";

export const handler: Handlers<Artwork | null> = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    if (!id) {
      return ctx.render(null);
    }
    const artwork = await getArtwork(id) as Artwork;
    return ctx.render(artwork);
  },
};

export default function Artwork({ params, data }: PageProps<Artwork | null>) {
  const { image, artist, title, alt, license, id, link, date } = data ?? {};
  return (
    <div class="mx-4 mt-2">
      <h1 class="text(gray-900 6xl) font(sans bold) cursor-default leading-relaxed">
        {title}
      </h1>
      {artist !== undefined && artist !== null && (
        <div className="flex items-center justify-start gap-2 ml-1.5">
          <img
            src={artist.profile_image ?? DEFAULT_AVATAR}
            alt={artist.name}
            class="rounded-md w-8 h-8"
            height="32"
            width="32"
          />
          <h2 class="text(gray-700) font(sans medium)">
            By{" "}
            <a
              href={`/artist/${
                artist?.github ?? slug(artist!.name, { lower: true })
              }`}
              class="text-underline hover:(no-underline text(blue-600)) font(semibold) text(gray-800)"
            >
              {artist?.name}
            </a>
          </h2>
        </div>
      )}
      <p class="text(gray-500 xs) font(sans medium) select-none leading-tight mt-4 pt-4 border(t gray-300)">
        Submitted{"  "}
        <time
          dateTime={date?.toUTCString()}
        >
          {date?.toLocaleDateString("en-US", {
            dateStyle: "long",
          })}
        </time>

        {license !== undefined && license !== null &&
          (` under ${license} license.`)}
      </p>

      <div className="grid">
        <a href={link ?? image} class="m-auto">
          <img src={image} alt={alt ?? title} />
        </a>
      </div>
    </div>
  );
}
