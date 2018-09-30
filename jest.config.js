// https://facebook.github.io/jest/docs/en/configuration.html

'use strict';

module.exports = {
  preset: '@minna-ui/jest-config',
  setupFiles: ['<rootDir>/test/__setup__.js'],
  collectCoverageFrom: [
    'src/**/*.{js,html}',
    '!src/client/index.js',
  ],
};
