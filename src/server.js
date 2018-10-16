/* tslint:disable no-console */

import compression from 'compression';
import polka from 'polka';
import sirv from 'sirv';
import * as sapper from '../__sapper__/server.js';
import db from './server/db';
import { log, parse } from './server/middleware';
import * as store from './store';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka()
  .use(
    log,
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    parse,
    sapper.middleware({
      store: store.server,
    }),
  )
  .listen(PORT, (err) => {
    if (err) console.error(err); // tslint:disable-line curly
  });

// clean up and close database connection on exit
process.on('SIGINT', () => {
  console.log('\nINFO: Closing database connection.');

  try {
    db.close();
    console.log('Server terminated');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
