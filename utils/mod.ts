import { DEFAULT_AVATARS } from "🛠️/constants.ts";
export function getRandomAvatar() {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
}
