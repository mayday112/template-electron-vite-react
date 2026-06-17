import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      external: ["better-sqlite3", "typeorm", "reflect-metadata"],
    },
  },
});
