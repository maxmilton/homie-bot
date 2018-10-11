import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as colors from 'colorette';
import { log, parse } from './server/middleware.js';
import * as store from './store';
import * as sapper from '../__sapper__/server.js';
import db from './server/db.js';

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
    if (err) console.log('error', err);
  });

// clean up and close database connection on exit
process.on('SIGINT', () => {
  console.log(colors.yellowBright('\nWARNING: Closing database connection.'));

  try {
    db.close();
    console.log('Server terminated');
    process.exit(0);
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
});
