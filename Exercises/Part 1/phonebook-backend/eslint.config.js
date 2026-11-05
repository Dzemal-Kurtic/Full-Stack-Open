import globals from "globals"
import js from "@eslint/js"
import { defineConfig } from "eslint/config"

export default defineConfig([
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.node } },
    rules: {
      eqeqeq: "error",
    },
  },
  {
    ignores: ["dist/**"],
  },
])
