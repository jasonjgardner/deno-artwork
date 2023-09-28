import { useContext } from "preact/hooks";
import { isAdmin, UserContext } from "🛠️/user.ts";

export default function LoginButton() {
  const user = useContext(UserContext);
  const userIsLoggedIn = user !== undefined && user !== null;
  const userIsAdmin = userIsLoggedIn && isAdmin(user?.login ?? "");

  if (!userIsLoggedIn) {
    return (
      <a
        href="/oauth/signin"
        class="text(white opacity-90 sm) font(sans medium)"
      >
        Sign in with GitHub
      </a>
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
        {userIsAdmin && (
          <a
            href="/admin"
            class="text(gray-300 md) font(sans normal) leading-tight"
            title="Access admin panel"
          >
            👑
          </a>
        )}
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
