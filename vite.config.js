import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { validateApiUrl } from "./scripts/validate-api-url.mjs";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  // Build-time guard (critic GAP-1): the bundle must not point at a
  // plain-http or otherwise unusable API origin. Throws on `vite build`.
  const apiUrl = validateApiUrl(process.env.VITE_API_URL ?? env.VITE_API_URL, command);

  return {
    plugins: [vue()],
    base: './',
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "~": fileURLToPath(new URL("./", import.meta.url)),
      },
    },
  };
});
