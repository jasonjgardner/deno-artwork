import { useContext } from "preact/hooks";
import { slug } from "slug/mod.ts";
import ReactionButton from "🏝️/ReactionButton.tsx";
import { UserContext } from "🛠️/user.ts";
import type { ArtworkEntry } from "🛠️/types.ts";

export default function ArtworkItem({ entry }: { entry: ArtworkEntry }) {
  const user = useContext(UserContext);
  const { artwork } = entry;
  const year = new Date(artwork.date).getFullYear();

  return (
    <article class="flex justify-start items-start group">
      <div class="bg-white 
        border border(gray-500 opacity-50) rounded-lg 
        shadow-md hover:(shadow-lg border-gray-400)
        transition transition[colors,shadow] duration-200 ease-out
        overflow-hidden">
        <div class="m-0 pb-2">
          <a
            href={`/piece/${artwork.id}`}
            class="flex flex-col gap-2"
          >
            <div class="bg-white
              shadow-sm
              transition-shadow duration-200 ease-out
              rounded-md border border-gray-400
              overflow-hidden
              scale-95
              group-hover:(scale-100 rounded-b-none shadow-none border(opacity-75 x-0 t-0) mt-0 mb-px) transition-[transform,colors,shadow] duration-200 ease-out">
              <img
                class="object-cover aspect-square
                  h-96 w-96"
                src={artwork.image}
                alt={artwork.alt}
              />
            </div>
            <div class="flex justify-between items-center mt-2 px-4">
              <h2 class="font(italic bold) text(gray-900 xl) line-clamp-2 leading-tight group-hover:underline hover:no-underline!">
                {artwork.title}
              </h2>
            </div>
          </a>
          <p class="text(gray-600 sm) font-semibold leading-relaxed px-4">
            By{" "}
            <a
              href={`/artist/${(artwork.artist.id ?? artwork.artist.github ??
                slug(artwork.artist.name, {
                  lower: true,
                }))}`}
              class="text-underline hover:no-underline"
            >
              {artwork.artist.name}
            </a>
            <time class="text(gray-500 xs) select-none ml-1 font-normal">
              ({year})
            </time>
          </p>
        </div>

        <div class="relative flex items-center justify-between mt-2.5 border(gray-100 t group-hover:gray-300) transition-colors ease-out duration-200">
          <ReactionButton {...{ entry }} />
          {user === null && (
            <a
              href="/oauth/signin"
              class="absolute z-10
                bg-[rgba(255,255,255,0.9)] filter backdrop-blur-md
                font(semibold sans) text(md center blue-500 underline) hover:no-underline
                ml-1 h-full w-full px-2
                flex items-center justify-center
                translate(y-full group-hover:(y-0))
                transition-transform duration-200 ease-out
                overflow-hidden"
            >
              Login to leave reaction
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
