import type { Handlers, PageProps } from "$fresh/server.ts";
import { cx } from "@twind/core";
import { getAuthenticatedUser } from "🛠️/github.ts";
import { isAdmin } from "🛠️/user.ts";
import type { Artwork, ReactionEntry } from "🛠️/types.ts";
import { getArtwork, getReactions, logUserSignIn } from "🛠️/db.ts";
import { main as storeStaticArtwork } from "../../scripts/store_static.ts";
import { ExternalLinkIcon, TrashIcon } from "📦/icon/mod.ts";

interface AdminProps {
  user: string;
  lastLogin: Date;
  success?: boolean;
  artwork: Artwork[];
  reactions: ReactionEntry[];
}

const artwork = [...[await getArtwork()]].flat();
const reactions = [...[await getReactions()]].flat();

export const handler: Handlers<AdminProps> = {
  async GET(req, ctx) {
    const user = await getAuthenticatedUser(req);

    if (!user || !isAdmin(user.login)) {
      return ctx.renderNotFound();
    }

    const lastLogin = await logUserSignIn(user);

    return ctx.render({
      user: user.login,
      lastLogin: new Date(lastLogin ?? Date.now()),
      artwork,
      reactions,
    });
  },
  async POST(req, ctx) {
    const user = await getAuthenticatedUser(req);

    if (!user || !isAdmin(user.login)) {
      return ctx.renderNotFound();
    }

    const lastLogin = await logUserSignIn(user);

    await storeStaticArtwork();
    return ctx.render({
      user: user.login,
      lastLogin: new Date(lastLogin ?? Date.now()),
      success: true,
      artwork,
      reactions,
    });
  },
};

export default function Admin({
  data,
}: PageProps<AdminProps>) {
  return (
    <section class="p-2">
      <h1>Admin</h1>
      {data?.success && <p>Successfully saved static artwork</p>}
      <form method="post">
        <button type="submit">Save static artwork</button>
      </form>

      <h2 class="font(sans bold) text(xl gray-900) leading-relaxed mt-4 pb-2">
        Artwork{" "}
        <span class="text(gray-400 sm) font-normal">
          ({data?.artwork.length ?? 0})
        </span>
      </h2>

      <div class="border border(gray-300) rounded-md mx-auto flex flex-col">
        <table class="table-auto">
          <thead>
            <tr class="divide(x gray-300) border(b gray-300)">
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Title
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Artist
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Image
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Alt
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                License
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Date
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Link
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                ID
              </td>
              <td
                class="text(sm left gray-900) font(sans semibold) px-1 py-2"
                scope="col"
              >
                Remove
              </td>
            </tr>
          </thead>
          <tbody class="divide(y gray-300)">
            {data?.artwork.map((artwork, idx) => (
              <tr
                key={artwork.id}
                class={cx(
                  idx % 2 === 0 ? "bg-gray-100" : "",
                  "hover:(bg-blue-50 text(gray-900)) transition duration-200 ease-out",
                  "h-12 divide(x gray-300)",
                )}
              >
                <td>
                  <a
                    class="text(sm blue-500 underline) font(sans bold) hover:(no-underline text(blue-600)) px-2"
                    href={`/piece/${artwork.id}`}
                  >
                    {artwork.title}
                  </a>
                </td>
                <td>
                  <a
                    class="text(sm blue-500 underline) font(sans medium) hover:(no-underline text(blue-600)) px-2"
                    href={`/artist/${
                      artwork.artist.id ?? artwork.artist.github
                    }`}
                  >
                    {artwork.artist.name}
                  </a>
                </td>
                <td>
                  <a
                    class="text(xs blue-500 underline) font(sans normal) hover:(no-underline text(blue-600)) px-2 truncate"
                    href={artwork.image}
                    target="_blank"
                  >
                    {artwork.image}
                  </a>
                </td>
                <td class="text-xs whitespace-wrap font(sans normal) leading-tight w-96 p-2">
                  {artwork.alt}
                </td>
                <td class="text(sm gray-800) font(sans normal) whitespace-nowrap px-2">
                  {artwork.license}
                </td>
                <td class="px-2">
                  <time class="text-xs">
                    {new Date(artwork.date).toLocaleDateString("en-US")}
                  </time>
                </td>
                <td class="whitespace-nowrap px-2 text-center">
                  {artwork.link && (
                    <a
                      href={artwork.link}
                      class="truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={artwork.link}
                    >
                      <ExternalLinkIcon class="inline-block w-4 h-4" />
                    </a>
                  )}
                </td>
                <td class="text-xs px-2">{artwork.id}</td>
                <td>
                  <label
                    class="flex items-center justify-center"
                    for="remove-{artwork.id}"
                  >
                    <span class="sr-only">Remove</span>

                    <input type="checkbox" name="remove[]" value={artwork.id} />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Reactions</h2>
      <table class="table-auto">
        <thead>
          <tr>
            <td>Artwork ID</td>
            <td>Reaction</td>
            <td>User</td>
          </tr>
        </thead>
        <tbody>
          {data?.reactions.map((reaction, idx) => (
            <tr key={idx}>
              <td>{reaction.artworkId}</td>
              <td>{reaction.reaction}</td>
              <td>{reaction.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
