import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const entry = (file) =>
    fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                home: entry("./index.html"),
                about: entry("./about.html"),
                map: entry("./map.html"),
            },
        },
    },
});