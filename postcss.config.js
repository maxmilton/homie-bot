// https://github.com/michael-ciniawsky/postcss-load-config

'use strict';

const minnaUi = require('@minna-ui/postcss-config');

module.exports = {
  parser: 'postcss-scss',
  map: true,
  plugins: [
    minnaUi({ debug: true }),
  ],
};
