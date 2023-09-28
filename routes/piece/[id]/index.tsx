import { asset, Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import type {
  Artwork,
  ArtworkEntry,
  GitHubUser,
  ReactionEntry,
} from "🛠️/types.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import { getArtwork, getArtworkReactions } from "🛠️/db.ts";
import { getRandomAvatar } from "🛠️/mod.ts";
import ShareButton from "🏝️/ShareButton.tsx";
import ReactionButton from "🏝️/ReactionButton.tsx";
import { slug } from "slug/mod.ts";

export interface ArtworkPageProps extends Omit<Artwork, "reactions"> {
  shareUrl: URL;
  reactions: ReactionEntry[];
  user: GitHubUser | null;
}

export const handler: Handlers<ArtworkPageProps | null> = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    if (!id) {
      return ctx.renderNotFound();
    }

    const user = await getAuthenticatedUser(req);
    const shareUrl = new URL(req.url);
    shareUrl.pathname = `/piece/${id}`;

    const artwork = await getArtwork(id) as Artwork;
    const reactions = await getArtworkReactions(id);

    return ctx.render({
      ...artwork,
      reactions,
      shareUrl,
      user,
    });
  },
};

export default function Artwork(
  { params, data }: PageProps<ArtworkPageProps | null>,
) {
  if (!data) {
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

  const { image, artist, title, alt, license, link, date, shareUrl } = data ?? {
    shareUrl: new URL(`/piece/${params.id}`, import.meta.url),
  };

  const entry: ArtworkEntry = {
    artwork: {
      id: params.id,
      image,
      artist,
      title,
      alt,
      license,
      link,
      date,
    },
    reactions: data.reactions,
  };

  return (
    <>
      <Head>
        <title>{title ?? "🎨"} - Deno Artwork</title>
        <meta name="description" content={alt ?? title} />
        <meta property="og:title" content={title ?? "Deno Artwork"} />
        <meta property="og:description" content={alt ?? title} />
        <meta
          property="og:image"
          content={`${shareUrl.href}/og`}
        />
        <meta
          property="og:url"
          content={shareUrl.href}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Deno Artwork" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <main class="mt-4 flex flex-col container mx-auto">
        <header class="flex flex-col">
          <h1 class="text(gray-900 6xl) font(sans bold) cursor-default md:leading-relaxed">
            {title}
          </h1>
          <div class="flex justify-between items-center">
            {artist !== undefined && artist !== null && (
              <a
                href={`/artist/${
                  artist?.github ?? slug(artist!.name, { lower: true })
                }`}
                class="flex items-center justify-start gap-2 ml-1.5 mt-2 select-none"
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
          </div>
        </header>

        <div class="grid grid-flow-row mt-4 pb-4 border(t gray-300)">
          <div class="ml-auto flex items-stretch justify-evenly flex-1 w-full divide-x border(b gray-300)">
            <ReactionButton user={data.user} {...{ entry }} />
            <ShareButton
              url={shareUrl}
              title={title ?? "Deno Artwork"}
              text={`Deno artwork created by ${artist?.name ?? "dinosaurs"}`}
            />
          </div>
          <figure class="flex flex-col gap-2 items-center justify-center mt-1">
            {image !== undefined && image !== null && (
              <a
                href={link ?? image}
                class="m-2 mt-4 max-h-screen max-w-screen select-none"
              >
                <img
                  class="w-full h-full aspect-auto object-contain rounded-sm shadow-sm"
                  src={asset(image)}
                  alt={alt ?? title}
                />
              </a>
            )}
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
          <section class="flex flex-col gap-2 px-2">
            {data.reactions.length > 0 && (
              <div class="flex flex-col gap-2 border(t gray-300) py-4 mt-4">
                <h2 class="text(gray-900 2xl) font(sans bold) cursor-default inline-flex items-end gap-2 leading-none">
                  Reactions{" "}
                  <span class="text(gray-600 sm) font(sans normal)">
                    ({data.reactions.length})
                  </span>
                </h2>
                <div class="grid grid-flow-row gap-2 px-2">
                  {data.reactions.map(({ user, reaction }) => (
                    <div
                      key={user}
                      class="flex flex(row nowrap) items-center justify-between gap-2 mr-auto cursor-default"
                    >
                      {reaction}
                      <a
                        href={`https://github.com/${user}`}
                        class="text(sm gray-700 left) font(sans medium) cursor-pointer hover:(text(blue-600) underline)"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {user}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
