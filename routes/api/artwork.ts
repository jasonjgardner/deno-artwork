import { HandlerContext } from "$fresh/server.ts";
import { getArtwork } from "../../utils/db.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  return new Response(
    JSON.stringify(await getArtwork()),
    {
      headers: {
        "content-type": "application/json",
      },
      status: 200,
    },
  );
};
