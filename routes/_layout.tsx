import { defineLayout } from "$fresh/server.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import { UserContext } from "🛠️/user.ts";
import AppHeader from "📦/AppHeader.tsx";
import AppFooter from "📦/AppFooter.tsx";

export default defineLayout(async (req, ctx) => {
  const user = await getAuthenticatedUser(req);
  const { pathname } = new URL(req.url);
  const isHome = pathname === "/";

  return (
    <div class="relative bg-neutral-500 min-h-screen flex flex-col">
      <UserContext.Provider value={user}>
        <AppHeader {...{ isHome }} />
        <div className="flex-grow z-0">
          <ctx.Component />
        </div>
      </UserContext.Provider>
      <AppFooter />
    </div>
  );
});
