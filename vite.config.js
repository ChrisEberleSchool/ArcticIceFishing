import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        about: resolve(__dirname, "about.html"),
        contact: resolve(__dirname, "contact.html"),
        whatsnew: resolve(__dirname, "whatsnew.html"),
      },
      output: {
        // Manual chunks for better code splitting
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  css: {
    preprocessorOptions: {
      css: {},
    },
  },
});
