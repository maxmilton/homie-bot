// https://eslint.org/docs/user-guide/configuring

'use strict';

module.exports = {
  root: true,
  extends: ['@minna-ui/eslint-config'],
  rules: {
    // Svelte components are in devDeps
    // TODO: Ideally this should be available as part of @minna-ui/eslint-config
    //  ↳ Maybe should open an issue on GitHub to request a feature to allow
    //    whitelisting certain packages
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
