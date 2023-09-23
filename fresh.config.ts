import { defineConfig } from "$fresh/server.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { createGitHubOAuthConfig, kvOAuthPlugin } from "kv_oauth/mod.ts";
export default defineConfig({
  plugins: [twindPlugin(twindConfig), kvOAuthPlugin(createGitHubOAuthConfig())],
});
