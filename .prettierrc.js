// https://prettier.io/docs/en/options.html

'use strict';

module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'all',

  overrides: [
    {
      files: '*.html',
      options: {
        htmlWhitespaceSensitivity: 'ignore',
        requirePragma: true,
      },
    },
  ],
};
