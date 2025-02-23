import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts",
        //  "src/**/*.ts", "src/**/*.tsx"
    ],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    sourcemap: true,
    target: "es2022",
    external: ["react", "react/jsx-runtime", "vinxi", "zod", "@tanstack/start"],
    minify: !options.watch,
    tsconfig: "tsconfig.lib.json",
    // banner: { js: '"use client";' },
}));