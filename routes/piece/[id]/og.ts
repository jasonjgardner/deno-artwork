import { HandlerContext } from "$fresh/server.ts";
import { getArtwork } from "🛠️/db.ts";
import type { Artwork } from "🛠️/types.ts";
import { decode, Image } from "imagescript/mod.ts";
import { join } from "$std/path/mod.ts";
export const handler = async (
  _req: Request,
  ctx: HandlerContext,
): Promise<Response> => {
  const { id } = ctx.params;
  if (!id) {
    return ctx.render(null);
  }
  const artwork = await getArtwork(id) as Artwork;
  if (!artwork) {
    return ctx.render(null);
  }

  const image = await decode(
    await Deno.readFile(join(Deno.cwd(), "static", artwork.image)),
    true,
  ) as Image;
  image.resize(1200, Image.RESIZE_AUTO).crop(0, 0, 1200, 630);

  const buffer = await image.encode();
  const headers = new Headers();
  headers.set("Content-Type", "image/png");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(buffer, { headers });
};
