/* eslint-disable no-console */

/**
 * FIXME: This feels a bit crap putting CSS in the server. Can it be just on the
 * client but still with auto rebuilds and even auto hot reloading?
 */
// global CSS
import './css/main.css';

import compression from 'compression';
import polka from 'polka';
import sirv from 'sirv';
import { log } from '@wearegenki/node-utils/lib/middleware/log';
import { parse } from '@wearegenki/node-utils/lib/middleware/parse';
import * as sapper from '@sapper/server'; // eslint-disable-line
import db from './server/db';
import { error } from './server/middeware/error';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

polka()
  .use(
    error,
    log,
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    parse,
    sapper.middleware(),
  )
  .listen(PORT, (err) => {
    if (err) console.error(err);
  });

// clean up and close database connection on exit
process.on('SIGINT', () => {
  console.log('\nClosing database connection...');

  try {
    db.close();
    console.log('Server terminated');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});
