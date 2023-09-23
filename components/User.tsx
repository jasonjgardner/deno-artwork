import type { GitHubUser } from "🛠️/types.ts";
import { isAdmin } from "🛠️/user.ts";
export default function Session(
  { user }: { user: GitHubUser | null | undefined },
) {
  const userIsLoggedIn = user !== undefined && user !== null;
  const userIsAdmin = userIsLoggedIn && isAdmin(user?.login ?? "");

  if (!userIsLoggedIn) {
    return (
      <div class="max-w-screen-lg mx-auto mt-8">
        <h4 class="text-4xl font-bold tracking-tight">Login</h4>
        <p class="mt-4 text-lg">
          <a href="/oauth/signin" class="link">
            Login
          </a>
        </p>
      </div>
    );
  }

  return (
    <div class="flex justify-start items-center px-2 border(l gray-500 opacity-50) py-2 gap-2">
      <img
        src={user?.avatar_url}
        alt={user?.login}
        class="rounded-sm w-12 h-12"
        width="32"
        height="32"
        title={`Logged in as "${user?.login}"`}
      />
      <div class="flex flex-col items-start justify-between h-full w-32 mt-auto">
        <p class="font(sans semibold) text(gray-100 sm) truncate leading-tight">
          {user.name}
        </p>
        <a
          href="/oauth/signout"
          class="text(gray-300 xs underline) font(sans normal) mt-auto mb-1 hover:(no-underline text(gray-100))"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
