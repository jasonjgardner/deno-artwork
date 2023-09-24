import type { Handlers } from "$fresh/server.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import { isAdmin } from "🛠️/user.ts";
import { logUserSignIn } from "🛠️/db.ts";
import { main as storeStaticArtwork } from "../../scripts/store_static.ts";

interface AdminProps {
  user: string;
  lastLogin: Date;
  success?: boolean;
}

export const handler: Handlers<AdminProps> = {
  async GET(req, ctx) {
    const user = await getAuthenticatedUser(req);

    if (!user || !isAdmin(user.login)) {
      return ctx.renderNotFound();
    }

    const lastLogin = await logUserSignIn(user);

    return ctx.render({
      user: user.login,
      lastLogin: new Date(lastLogin ?? Date.now()),
    });
  },
  async POST(req, ctx) {
    const user = await getAuthenticatedUser(req);

    if (!user || !isAdmin(user.login)) {
      return ctx.renderNotFound();
    }

    const lastLogin = await logUserSignIn(user);

    await storeStaticArtwork();
    return ctx.render({
      user: user.login,
      lastLogin: new Date(lastLogin ?? Date.now()),
      success: true,
    });
  },
};

export default function Admin() {
  return (
    <div>
      <h1>Admin</h1>
      <form method="post">
        <button type="submit">Save static artwork</button>
      </form>
    </div>
  );
}
