import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    fileParallelism: false,
    maxWorkers: 1,
    isolate: false,
    pool: "threads",
  },
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
});
