// https://github.com/michael-ciniawsky/postcss-load-config

/* tslint:disable object-literal-sort-keys */

'use strict';

/* eslint-disable-next-line import/no-extraneous-dependencies */
const minnaUi = require('@minna-ui/postcss-config');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
  syntax: 'postcss-scss',
  map: dev,
  plugins: [
    minnaUi({ debug: dev }),
  ],
};
