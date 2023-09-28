import RSS from "https://esm.sh/rss@1.2.2";
import { asset } from "$fresh/runtime.ts";
import { HandlerContext } from "$fresh/server.ts";
import { getArtwork } from "🛠️/db.ts";
import type { Artwork } from "🛠️/types.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const artwork = await getArtwork() as Artwork[];
  const feed = new RSS({
    title: "Deno Artwork",
    description: "Deno-inspired artwork",
    feed_url: "https://artwork.deno.dev/feed",
    site_url: "https://artwork.deno.dev/",
    image_url: "https://artwork.deno.dev/favicon.svg",
  });

  artwork.forEach((art) => {
    feed.item({
      title: art.title,
      description: art.alt,
      url: `https://artwork.deno.dev/artwork/${art.id}`,
      guid: `${art.id}-${art.artist}-${art.date}`,
      date: art.date,
      author: art.artist.name,
      enclosure: {
        url: `https://artwork.deno.dev/${asset(art.image)}`,
      },
      categories: ["artwork", "deno"],
    });
  });

  return new Response(
    feed.xml(),
    {
      headers: {
        "content-type": "application/rss+xml",
      },
      status: 200,
    },
  );
};
