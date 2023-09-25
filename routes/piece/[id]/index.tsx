import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import type { Artwork } from "🛠️/types.ts";
import { getArtwork } from "🛠️/db.ts";
import { getRandomAvatar } from "🛠️/mod.ts";
import ShareButton from "🏝️/ShareButton.tsx";
import { slug } from "slug/mod.ts";

export interface ArtworkPageProps extends Artwork {
  shareUrl: URL;
}

export const handler: Handlers<ArtworkPageProps | null> = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    if (!id) {
      return ctx.renderNotFound();
    }

    const shareUrl = new URL(req.url);
    shareUrl.pathname = `/piece/${id}`;

    const artwork = await getArtwork(id) as Artwork;
    return ctx.render({
      ...artwork,
      shareUrl,
    });
  },
};

export default function Artwork(
  { params, data }: PageProps<ArtworkPageProps | null>,
) {
  const { image, artist, title, alt, license, id, link, date, shareUrl } =
    data ?? {
      shareUrl: new URL(`https://${location.hostname}/piece/${params.id}`),
    };

  return (
    <>
      <Head>
        <title>{title ?? "🎨"} | Deno Artwork</title>
        <meta name="description" content={alt ?? title} />
        <meta property="og:title" content={title ?? "Deno Artwork"} />
        <meta property="og:description" content={alt ?? title} />
        <meta
          property="og:image"
          content={`https://${location.hostname}/piece/${id}/og`}
        />
        <meta
          property="og:url"
          content={`https://${location.hostname}/piece/${id}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Deno Artwork" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <div class="mt-4 flex flex-col container mx-auto">
        <div class="flex flex-col">
          <h1 class="text(gray-900 6xl) font(sans bold) cursor-default md:leading-relaxed">
            {title}
          </h1>
          <div class="flex justify-between items-center">
            {artist !== undefined && artist !== null && (
              <a
                href={`/artist/${
                  artist?.github ?? slug(artist!.name, { lower: true })
                }`}
                class="flex items-center justify-start gap-2 ml-1.5 mt-2"
                title={`View ${artist?.name}'s artwork contributions`}
              >
                <img
                  src={artist.profile_image ?? getRandomAvatar()}
                  alt={artist.name}
                  class="rounded-md w-8 h-8"
                  height="48"
                  width="48"
                />
                <h2 class="text(gray-700) font(sans medium)">
                  By{" "}
                  <span class="text-underline hover:(no-underline text(blue-600)) font(semibold) text(gray-800)">
                    {artist?.name}
                  </span>
                </h2>
              </a>
            )}
            <ShareButton
              url={shareUrl}
              title={title ?? "Deno Artwork"}
              text={`Deno artwork created by ${artist?.name ?? "dinosaurs"}`}
            />
          </div>
        </div>

        <div class="grid mt-4 pt-2 pb-4 border(t gray-300)">
          <figure class="flex flex-col gap-2">
            <a
              href={link ?? image}
              class="mx-auto mt-4 mb-2 max-h-screen max-w-screen"
            >
              <img
                class="w-full h-full aspect-auto object-contain rounded-sm shadow-sm"
                src={image}
                alt={alt ?? title}
              />
            </a>
            <figcaption class="text(gray-500 xs center) font(sans medium) select-none leading-loose">
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
            </figcaption>
          </figure>
        </div>
      </div>
    </>
  );
}
