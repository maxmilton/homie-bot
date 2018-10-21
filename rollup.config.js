// import path from 'path';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import preprocessMarkup from '@minna-ui/svelte-preprocess-markup';
import preprocessStyle from '@minna-ui/svelte-preprocess-style';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import svelte from 'rollup-plugin-svelte';
import typescript from 'rollup-plugin-typescript';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';
import { makeCss } from './rollup-plugins.js';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const makeCssOpts = {
  include: ['src/css/**/*.css'],
};

/** Svelte preprocessors */
const preprocess = {
  markup: preprocessMarkup({ level: dev ? 0 : 3 }),
  style: preprocessStyle(),
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.GIT_RELEASE': JSON.stringify(process.env.GIT_RELEASE),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      makeCss(makeCssOpts),
      svelte({
        dev,
        emitCss: true,
        hydratable: true,
        preprocess,
      }),
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),

      // TODO: Use ADVANCED mode once dynamic import is supported https://git.io/fxwrR
      // FIXME: Breaks export; wait until fixed upstream
      // !dev && compiler({
      //   charset: 'UTF-8',
      //   compilation_level: 'SIMPLE',
      // }),
    ],

    // treeshake: {
    //   propertyReadSideEffects: false,
    // },

    // temporary, pending Rollup 1.0
    experimentalCodeSplitting: true,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.GIT_RELEASE': JSON.stringify(process.env.GIT_RELEASE),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      makeCss(makeCssOpts),
      svelte({
        dev,
        generate: 'ssr',
        preprocess,
      }),
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),
    ],
    external: Object.keys(pkg.dependencies) // tslint:disable-line object-literal-sort-keys
      .filter(dep => !/^@minna-ui/.test(dep)) // minna-ui packages in dependencies
      .concat(require('module').builtinModules), // eslint-disable-line global-require

    // temporary, pending Rollup 1.0
    experimentalCodeSplitting: true,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      resolve(),
      commonjs(),

      !dev && compiler({
        compilation_level: 'ADVANCED',
      }),
    ],
  },
};
