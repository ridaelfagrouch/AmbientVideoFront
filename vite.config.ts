// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/jamendo": {
          target: env.VITE_JAMENDO_API_URL || "https://api.jamendo.com/v3.0",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/jamendo/, ""),
        },
        "/audio": {
          target:
            env.VITE_JAMENDO_STORAGE_URL ||
            "https://prod-1.storage.jamendo.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/audio/, ""),
        },
        "/api": {
          target: env.VITE_API_URL || "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
