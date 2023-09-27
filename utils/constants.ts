import type { Reaction } from "./types.ts";
export const MAX_IMAGE_WIDTH = 1080;
export const MAX_IMAGE_HEIGHT = 1080;
export const MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3MB

/**
 * Default avatars to use if the user doesn't have a GitHub avatar
 * @see https://deno-avatar.deno.dev/
 */
export const DEFAULT_AVATARS = [
  "https://deno-avatar.deno.dev/avatar/12fdaa.svg",
  "https://deno-avatar.deno.dev/avatar/7a9fd1.svg",
  "https://deno-avatar.deno.dev/avatar/99b954.svg",
  "https://deno-avatar.deno.dev/avatar/4fac21.svg",
];

export const REACTIONS: Reaction[] = ["👍", "❤️", "🦕", "🍕"];

export const DEFAULT_REACTION = REACTIONS[0];
