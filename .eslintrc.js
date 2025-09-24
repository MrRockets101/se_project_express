module.exports = {
  env: {
    es2021: true,
    node: true,
  },

  extends: ["eslint:recommended", "airbnb-base", "prettier"],

  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  rules: {
    // Allow console.error
    "no-console": ["warn", { allow: ["error"] }],

    // Allow dangling underscores for _id and in certain contexts
    "no-underscore-dangle": [
      "error",
      {
        allow: ["_id"],
        allowAfterThis: true,
        allowAfterSuper: true,
        allowAfterThisConstructor: true,
      },
    ],
  },
};
