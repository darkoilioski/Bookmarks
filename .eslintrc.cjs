module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "prettier", // Ensure compatibility with Prettier
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "unused-imports"], // Add the unused-imports plugin
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "unused-imports/no-unused-imports": "error", // Add rule to remove unused imports
    "unused-imports/no-unused-vars": [
      "error",
      { vars: "all", args: "none", ignoreRestSiblings: true }, // Rule to handle unused vars
    ],
  },
};
