import {
  createGitHubOAuthConfig,
  getSessionAccessToken,
  getSessionId,
} from "kv_oauth/mod.ts";
import type { GitHubUser } from "./types.ts";
export async function getAuthenticatedUser(
  req: Request,
): Promise<GitHubUser | null> {
  const sessionId = getSessionId(req);

  if (!sessionId) {
    return null;
  }

  const accessToken = await getSessionAccessToken(
    createGitHubOAuthConfig(),
    sessionId,
  );
  const response = await fetch("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  return await response.json();
}
