import { createContext } from "preact";
import type { GitHubUser } from "🛠️/types.ts";
export const UserContext = createContext<GitHubUser | null>(null);

export function isAdmin(userId: GitHubUser["login"]) {
  const adminIds = Deno.env.get("ADMIN_USER_ID")?.split(",") ?? [];
  return adminIds.includes(userId);
}
