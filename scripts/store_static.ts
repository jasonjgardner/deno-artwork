#!/usr/bin/env -S deno run -A --unstable
import {
  deleteArtwork,
  loadSavedArtwork,
  loadStaticArtwork,
  saveArtwork,
} from "🛠️/db.ts";

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
