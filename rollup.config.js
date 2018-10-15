import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import svelte from 'rollup-plugin-svelte';
import preprocessMarkup from '@minna-ui/svelte-preprocess-markup';
import preprocessStyle from '@minna-ui/svelte-preprocess-style';
import { terser } from 'rollup-plugin-terser';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import config from 'sapper/config/rollup.js';
import { makeCss } from './rollup-plugins.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

/** Svelte preprocessors */
const preprocess = {
  markup: preprocessMarkup({ level: dev ? 0 : 3 }),
  style: preprocessStyle(),
};

const makeCssOpts = {
  include: 'src/css/**/*.css',
  whitelist: [
    // 'nav-item',
    // 'nav-item-active',
  ],
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.GIT_RELEASE': JSON.stringify(process.env.GIT_RELEASE),
      }),
      makeCss(makeCssOpts),
      svelte({
        dev,
        preprocess,
        hydratable: true,
        emitCss: true,
      }),
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),

      !dev && terser({ module: true }),
      // !dev && compiler({
      //   externs: [
      //     require.resolve('google-closure-compiler/contrib/externs/svg.js'),
      //     path.join(__dirname, 'externs.js'),
      //   ],
      //   charset: 'UTF-8',
      //   compilation_level: 'ADVANCED',
      //   // language_in: 'ECMASCRIPT_NEXT',
      //   // language_out: 'STABLE',
      //   // strict_mode_input: true,
      //   // use_types_for_optimization: true,
      //   // warning_level: 'VERBOSE',
      //   // jscomp_warning: '*',
      //   // jscomp_error: '*',
      //   jscomp_off: 'duplicate', // FIXME: Deprecated `methods` var
      //   // debug: true,
      //   // formatting: 'PRETTY_PRINT',
      // }),
    ],

    treeshake: {
      propertyReadSideEffects: false,
    },

    // temporary, pending Rollup 1.0
    experimentalCodeSplitting: true,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.GIT_RELEASE': JSON.stringify(process.env.GIT_RELEASE),
      }),
      makeCss(makeCssOpts),
      svelte({
        dev,
        preprocess,
        generate: 'ssr',
      }),
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),
    ],
    external: Object.keys(pkg.dependencies)
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
        'process.env.GIT_RELEASE': JSON.stringify(process.env.GIT_RELEASE),
      }),
      resolve(),
      commonjs(),
      !dev
        && compiler({
          compilation_level: 'ADVANCED',
        }),
    ],
  },
};
