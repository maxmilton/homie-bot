// https://facebook.github.io/jest/docs/en/configuration.html

/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  preset: '@minna-ui/jest-config',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.(html|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  testRegex: '(/__tests__/.*|\\.(test|spec))\\.[jt]s$',
  moduleFileExtensions: ['html', 'js', 'json', 'ts'],
  collectCoverageFrom: ['src/**/*.{html,js,ts}'],
  globals: {
    'ts-jest': {
      diagnostics: false, // FIXME: Enable this once types are stable
    },
  },
};
