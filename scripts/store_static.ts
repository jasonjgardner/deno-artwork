#!/usr/bin/env -S deno run -A --unstable
import { parse } from "$std/flags/mod.ts";
import artworkData from "💽/artwork.json" assert { type: "json" };
import type { Artwork } from "🛠️/types.ts";
import { deleteArtwork, loadSavedArtwork, saveArtwork } from "🛠️/db.ts";
import { slug } from "slug/mod.ts";

const { clear } = parse(Deno.args, { boolean: ["clear"] });

export function loadStaticArtwork(): Artwork[] {
  // Get images from /static directory
  const artworks: Artwork[] = artworkData.map((a) => ({
    id: slug(`${a.title} ${a.artist.id}`, {
      lower: true,
    }),
    ...a,
    artist: {
      ...a.artist,
      id: a.artist.id ?? a.artist.github ??
        slug(a.artist.name, { lower: true }),
    },
    date: new Date(a.date),
  }));

  return artworks;
}

export async function deleteSavedArtwork() {
  const savedArtwork = await loadSavedArtwork();
  savedArtwork.forEach((art) => {
    console.log("Deleting %c%s", "color: red", art.id);
    deleteArtwork(art);
  });
}

export function saveStaticArtwork() {
  const artwork = loadStaticArtwork();
  artwork.forEach(async (art) => {
    console.log("Saving %c%s", "color: cyan", art.id);
    try {
      const key = await saveArtwork(art);
      console.log("Saved to %c%s", "color: gray", key.join("/"));
    } catch (err) {
      console.error(`Failed saving ${art.id}: %s`, err);
    }
  });
}

export async function main(clearExisting = false) {
  if (clearExisting) {
    console.log("%cClearing existing artwork...", "color: orange");
    await deleteSavedArtwork();
  }

  console.log("%cSaving static artwork to KV database...", "color: green");
  saveStaticArtwork();
}

if (import.meta.main) {
  await main(clear);
}
