// https://facebook.github.io/jest/docs/en/configuration.html

/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  preset: '@minna-ui/jest-config',
  transform: {
    '^.+\\.[jt]s$': 'ts-jest',
    // '^.+\\.m?js$': 'babel-jest',
    '^.+\\.(html|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  testRegex: '(/__tests__/.*|(\\.|/)test)\\.ts$',
  collectCoverageFrom: ['src/**/*.{js,html,ts}'],
  globals: {
    'ts-jest': {
      // isolatedModules: true,
      // diagnostics: false,
      // babelConfig: true,
    },
  },
};
