import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ["tests/js/fixtures/commonjs/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  js.configs.recommended,
  eslintConfigPrettier,
];
