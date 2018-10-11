import * as colors from 'colorette';
import { Next, Req, Res } from './types';

/**
 * Log server requests.
 */
export function log(req: Req, res: Res, next: Next) {
  const start = process.hrtime();

  function writeLog() {
    const durration = process.hrtime(start);
    const { method, originalUrl, url } = req;
    const { statusCode } = res;
    /* eslint-disable-next-line no-nested-ternary */
    const color = statusCode >= 400 ? 'red' : statusCode >= 300 ? 'yellow' : 'green';
    const timing = `${(durration[1] / 1e6).toFixed(2)}ms`;
    console.log(`» ${timing} ${colors[color](statusCode)} ${method} ${originalUrl || url}`);
  }
  res.on('finish', writeLog);
  res.on('error', writeLog);
  next();
}

/**
 * Parse raw request body data and convert it to JSON.
 */
export function parse(req: Req, res: Res, next: Next) {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });
  req.on('end', () => {
    req.rawBody = data;
    if (req.headers['content-type'].indexOf('application/json') !== -1
      && data
      && data.indexOf('{') !== -1
    ) {
      req.body = JSON.parse(data);
    }
    next();
  });
}
