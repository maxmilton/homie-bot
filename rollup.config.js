import compiler from '@ampproject/rollup-plugin-closure-compiler';
import { gitDescribe, postcss, preMarkup, preStyle } from 'minna-ui';
// import path from 'path';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import sucrase from 'rollup-plugin-sucrase';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import config from 'sapper/config/rollup.js';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const appRelease = gitDescribe();

const postcssOpts = {
  include: ['src/css/**/*.css'],
};

/** Svelte preprocessors */
const preprocess = {
  markup: preMarkup({ level: dev ? 0 : 3 }),
  style: preStyle(),
};

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.GIT_RELEASE': JSON.stringify(appRelease),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      postcss(postcssOpts),
      svelte({
        dev,
        preprocess,
        emitCss: true,
        hydratable: true,
      }),
      resolve({
        // extensions: ['.js', '.ts'],
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      !dev
        ? typescript({
            exclude: ['*.css', 'node_modules/**'],
            include: 'src/**',
            typescript: require('typescript'), // eslint-disable-line global-require
          })
        : sucrase({
            exclude: ['**/*.css', '*.css'],
            transforms: ['typescript'],
          }),

      // FIXME: Replace terser with closure compiler once it supports import correctly
      !dev &&
        terser({
          ecma: 8,
          module: true,
        }),
      // TODO: Use ADVANCED mode once dynamic import is supported https://git.io/fxwrR
      // FIXME: Breaks export; wait until fixed upstream; or may be something related to ts
      // !dev &&
      //   compiler({
      //     // externs: [
      //     //   require.resolve('google-closure-compiler/contrib/externs/svg.js'),
      //     //   path.join(__dirname, 'externs.js'),
      //     // ],

      //     // charset: 'UTF-8',
      //     compilation_level: 'SIMPLE',
      //     // compilation_level: 'ADVANCED',
      //     // jscomp_off: '*', // FIXME: Svelte errors
      //   }),
    ],
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.GIT_RELEASE': JSON.stringify(appRelease),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // postcss(postcssOpts),
      svelte({
        dev,
        preprocess,
        generate: 'ssr',
      }),
      resolve({
        extensions: ['.js', '.ts'],
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      !dev
        ? typescript({
            exclude: ['node_modules/**'],
            include: 'src/**',
            typescript: require('typescript'), // eslint-disable-line global-require
          })
        : sucrase({
            exclude: ['node_modules/**'],
            include: 'src/**',
            transforms: ['typescript'],
          }),
    ],
    external: Object.keys(pkg.dependencies) // tslint:disable-line object-literal-sort-keys
      .filter(dep => !/^@minna-ui/.test(dep)) // minna-ui packages in dependencies
      .concat(require('module').builtinModules), // eslint-disable-line global-require
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

      !dev &&
        compiler({
          compilation_level: 'ADVANCED',
        }),
    ],
  },
};
