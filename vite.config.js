import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/turisticky-kruzok/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        passport: resolve(__dirname, "pas/index.html"),
        admin: resolve(__dirname, "admin/index.html"),
        checkin: resolve(__dirname, "checkin/index.html"),
        redirect: resolve(__dirname, "auth/redirect.html")
      }
    }
  }
});
