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
        insertPragma: true,
        requirePragma: true,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'never',
      },
    },
  ],
};
