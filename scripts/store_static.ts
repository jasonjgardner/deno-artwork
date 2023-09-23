#!/usr/bin/env -S deno run -A --unstable
import artworkData from "../data/artwork.json" assert { type: "json" };
import type { Artwork } from "../utils/types.ts";
import { slug } from "slug/mod.ts";
import { deleteArtwork, loadSavedArtwork, saveArtwork } from "🛠️/db.ts";

export function loadStaticArtwork(): Artwork[] {
  // Get images from /static directory
  const artworks: Artwork[] = artworkData.map((a) => ({
    id: slug(`${a.title} ${a.artist.name}`, {
      lower: true,
    }),
    ...a,
    artist: {
      ...a.artist,
      github: a.artist.github ?? "#",
    },
    date: new Date(a.date),
  }));

  return artworks;
}

export async function main() {
  const savedArtwork = await loadSavedArtwork();
  savedArtwork.forEach((art) => {
    deleteArtwork(art);
  });

  const artwork = loadStaticArtwork();
  artwork.forEach((art) => {
    saveArtwork(art);
  });
}

if (import.meta.main) {
  await main();
}
