import { readFileSync } from 'fs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import preprocessMarkup from '@minna-ui/svelte-preprocess-markup';
import preprocessStyle from '@minna-ui/svelte-preprocess-style';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { makeCss, makeHtml } from './rollup-plugins.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const watch = { chokidar: true, clearScreen: false };
const template = readFileSync(path.join(__dirname, '/src/client/template.html'), 'utf8');

export default [
  // client
  {
    watch,
    input: 'src/client/index.js',
    output: {
      sourcemap: dev,
      format: 'esm',
      dir: 'dist/client',
      entryFileNames: '[name].[hash].js',
      chunkFileNames: '[name].[hash].js',
    },
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // makeCss({ include: 'src/client/css/**/*.css' }),
      makeCss(),
      svelte({
        dev,
        preprocess: {
          ...(dev ? {} : { markup: preprocessMarkup({
            unsafeWhitespace: true,
            unsafe: true,
          }) }),
          style: preprocessStyle(),
        },
        // FIXME: Enable this
        // emitCss: true,
      }),
      resolve(),
      commonjs(),

      !dev && compiler({
        externs: 'externs.js',
        charset: 'UTF-8',
        compilation_level: 'ADVANCED',
        // formatting: 'PRETTY_PRINT',
        // debug: true,
      }),

      makeHtml({
        template,
        fileName: 'index.html',
        title: 'Home Control',
        content: '%CSS%\n%JS%',
      }),
    ],

    // temporary, pending Rollup 1.0
    experimentalCodeSplitting: true,

    shimMissingExports: true,
    treeshake: {
      pureExternalModules: true,
      propertyReadSideEffects: false,
    },
  },

  // server
  {
    watch,
    input: 'src/server/index.js',
    output: {
      sourcemap: dev,
      format: 'cjs',
      file: 'dist/server.js',
    },
    plugins: [
      resolve(),
      commonjs(),

      !dev && compiler(),
    ],
    /* eslint-disable-next-line global-require */
    external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
  },
];
