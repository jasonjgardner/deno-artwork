import { JSX } from "preact";
import type { Artwork } from "🛠️/types.ts";
import { slug } from "slug/mod.ts";

export default function Item({ artwork }: { artwork: Artwork }): JSX.Element {
  return (
    <article class="flex justify-start items-start group">
      <div class="border border(gray-500 opacity-50) p-2 rounded-lg bg-white shadow-md">
        <a
          href={`/piece/${artwork.id}`}
          class="flex flex-col gap-2"
        >
          <div class="rounded-md shadow-sm group-hover:shadow transition-shadow duration-200 ease-in-out bg-white border border(gray-400) overflow-hidden">
            <img
              class="object-cover aspect-square h-96 w-96 group-hover:scale-105 transition-transform duration-200 ease-in-out"
              src={artwork.image}
              alt={artwork.alt}
            />
          </div>
          <div class="flex justify-between items-center mt-2">
            <h2 class="font(italic bold) text(gray-900 xl) line-clamp-2 leading-tight">
              {artwork.title}
            </h2>
          </div>
        </a>
        <p class="text(gray-600 sm) font-semibold leading-tight">
          By{" "}
          <a
            href={`/artist/${
              artwork.artist.github ?? slug(artwork.artist.name, {
                lower: true,
              })
            }`}
            class="text-underline hover:no-underline"
          >
            {artwork.artist.name}
          </a>
          <time
            class="text(gray-500 xs) select-none ml-1 font-normal"
            dateTime={artwork.date.toUTCString()}
          >
            ({artwork.date.getFullYear()})
          </time>
        </p>
      </div>
    </article>
  );
}
