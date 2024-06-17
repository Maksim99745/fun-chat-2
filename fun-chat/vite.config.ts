import { defineConfig } from "vite";

export default defineConfig({
    esbuild: {
        target: "es2018",
    },
    base: "./",
});
