/* eslint-disable import/no-extraneous-dependencies */
import { writeFile } from 'fs';
import path from 'path';
import { createFilter } from 'rollup-pluginutils';
import postcssrc from 'postcss-load-config';
import postcss from 'postcss';
/* eslint-enable */

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err
 */
export function catchErr(err) {
  if (err) throw err;
}

/**
 * Rollup plugin to generate HTML from a template and write it to disk
 * @param {object} opts
 * @param {object=} opts.context Base PostCSS options.
 * @param {string|Function} opts.content Page content.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 */
export function makeCss({
  context = {},
  exclude = [],
  include = ['**/*.css'],
} = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'makeCss',

    async transform(source, id) {
      if (!filter(id)) return null;

      try {
        // const ctx = Object.assign({ from: id, to: id, map: true }, context);
        const ctx = Object.assign({ from: id, to: id, map: false }, context);
        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, options);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { line: warn.line, column: warn.column });
        });

        return result.css;
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
  ...options
}) {
  const filter = createFilter(include, exclude);
  const injectHtml = compileTemplate(template);
  const styles = {};

  return {
    name: 'makeHtml',
    transform(source, id) {
      if (!filter(id)) return null;

      styles[id] = source;

      return '';
    },
    async generateBundle(outputOptions, bundle) {
      // combine all style sheets
      let css = '';
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
        title,
        content: body,
        ...options,
      }).trim(), catchErr);
    },
  };
}
