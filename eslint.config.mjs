export default {
  // Use flat config
  rules: {
    // Allow unused vars prefixed with _
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    // Allow console in server-side code
    "no-console": "off",
  },
};
