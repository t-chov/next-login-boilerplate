import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
  },
  target: "es2022",
  format: ["esm"],
  sourcemap: false,
  clean: true,
  dts: true,
  shims: true,
});
