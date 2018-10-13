// https://eslint.org/docs/user-guide/configuring

'use-strict';

module.exports = {
  root: true,
  extends: [
    '@minna-ui/eslint-config',
  ],
  rules: {
    // Svelte components are in devDeps
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
