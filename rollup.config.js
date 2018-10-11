import { readFileSync } from 'fs';
import path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
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
    input: 'src/client/index.ts',
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
          // TODO: Change level `3` to `4` once minna-ui components support it
          markup: preprocessMarkup({ level: dev ? 0 : 3 }),
          style: preprocessStyle(),
        },
        // FIXME: Enable this
        // emitCss: true,
      }),
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),

      !dev && compiler({
        externs: 'externs.js',
        charset: 'UTF-8',
        compilation_level: 'ADVANCED',
        // debug: true,
        // formatting: 'PRETTY_PRINT',
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
  },

  // server
  {
    watch,
    input: 'src/server/index.ts',
    output: {
      sourcemap: dev,
      format: 'cjs',
      file: 'dist/server.js',
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        typescript: require('typescript'), // eslint-disable-line global-require
      }),

      !dev && compiler(),
    ],
    /* eslint-disable-next-line global-require */
    external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
  },
];
