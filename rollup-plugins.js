/* eslint-disable import/no-extraneous-dependencies */
import { writeFile } from 'fs';
import path from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import Purgecss from 'purgecss';
import { createFilter } from 'rollup-pluginutils';
/* eslint-enable */

const dev = process.env.NODE_ENV === 'development';

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err
 */
export function catchErr(err) {
  if (err) throw err; // tslint:disable-line curly
}

/**
 * Rollup plugin to generate HTML from a template and write it to disk
 * @param {object} opts
 * @param {object=} opts.context Base PostCSS options.
 * @param {string|Function} opts.content Page content.
 * @param {(Array<string>|string)=} opts.exclude Files to exclude from CSS processing.
 * @param {(Array<string>|string)=} opts.include Files to include in CSS processing.
 * @param {(Array<string>|string)=} opts.content Files to parse for CSS classes.
 * @param {Array<string>=} opts.whitelist CSS classes to always keep.
 */
export function makeCss({
  context = {},
  exclude = [],
  include = ['**/*.css'],
  content = [
    '__sapper__/**/*.html',
    '__sapper__/**/*.js',
    'src/**/*.html',
    'src/**/*.js',
  ],
  whitelist = [],
} = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'makeCss',

    async transform(source, id) {
      if (!filter(id)) return null; // tslint:disable-line curly

      try {
        const ctx = Object.assign({ from: id, to: id, map: true }, context);
        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, options);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { line: warn.line, column: warn.column });
        });

        if (dev) return result.css; // tslint:disable-line curly

        const purgecss = new Purgecss({
          content,
          css: [{
            raw: result.css,
          }],
          keyframes: true,
          whitelist,
        });

        return purgecss.purge()[0].css;
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          throw err;
        }
      }

      return null;
    },
  };
}

/**
 * Ultra-minimal template engine.
 * @see https://github.com/Drulac/template-literal
 * @param {string} template A HTML template to compile.
 * @returns {Function}
 */
function compileTemplate(template) {
  return new Function('d', 'return `' + template + '`'); // eslint-disable-line
}

/**
 * Rollup plugin to generate HTML from a template and write it to disk
 * @param {object} opts
 * @param {string} opts.fileName File path where to save generated HTML document.
 * @param {string} opts.template HTML document template.
 * @param {string=} opts.title Page title.
 * @param {string|Function} opts.content Page content.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 */
export function makeHtml({
  fileName,
  template,
  title,
  content,
  exclude,
  include = ['**/*.css', '**/*.postcss', '**/*.pcss'],
  ...options // tslint:disable-line trailing-comma
}) {
  const filter = createFilter(include, exclude);
  const injectHtml = compileTemplate(template);
  const styles = {};

  return {
    name: 'makeHtml',
    transform(source, id) {
      if (!filter(id)) return null; // tslint:disable-line curly

      styles[id] = source;

      return '';
    },
    async generateBundle(outputOptions, bundle) {
      // combine all style sheets
      let css = '';
      /* tslint:disable-next-line forin */
      for (const id in styles) { // eslint-disable-line
        css += styles[id] || '';
      }

      const jsFileName = Object.values(bundle)[0].fileName;
      const cssFileName = jsFileName.replace(/js$/, 'css');

      let body = content;
      body = body.replace('%CSS%', css.length ? `<link href=/${cssFileName} rel=stylesheet>` : '');
      body = body.replace('%JS%', `<script src=/${jsFileName} async type=module></script>`);

      // write CSS file
      writeFile(path.join(__dirname, outputOptions.dir, cssFileName), css, catchErr);

      // write HTML file
      writeFile(path.join(__dirname, outputOptions.dir, fileName), injectHtml({
        content: body,
        title,
        ...options,
      }).trim(), catchErr);
    },
  };
}
