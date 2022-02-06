import { resolve } from "path";
import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import content from "@originjs/vite-plugin-content";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), content()],
  base: process.env.BASE_PATH ? process.env.BASE_PATH : "./",
  resolve: {
    alias: {
      "@": resolve("client"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
});
