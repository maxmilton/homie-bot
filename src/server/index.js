import sirv from 'sirv';
import polka from 'polka';
import * as colors from 'colorette';
import { parse, log } from './middleware.js';
import * as routes from './routes.js';
import db from './db.js';

import * as yeelight from './plugins/yeelight.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const port = PORT || 5000;

const serve = sirv('dist/client', { dev });

/** Serve SPA index.html when no matching route. */
function onNoMatch(req, res) {
  serve({ path: '/' }, res, (response) => {
    /* eslint-disable-next-line no-param-reassign */
    response.statusCode = 404;
    response.end();
  });
}

polka({ onNoMatch })
  // set up middleware
  .use(log, serve, parse)

  // set up routes
  .get('/api/device/:id?', routes.getDevice)
  .put('/api/device/:id?', routes.putDevice)
  .delete('/api/device/:id', routes.deleteDevice)
  .post('/api/query', routes.postQuery)
  .get('/api/reset', routes.getDbReset)

  .get('/api/toggle', yeelight.toggle)
  .get('/api/command', yeelight.command)
  .get('/api/red', yeelight.red)
  .get('/api/blue', yeelight.blue)
  .get('/api/dim', yeelight.dim)
  .get('/api/bright', yeelight.bright)

  // start server
  .listen(port, (err) => {
    if (err) console.error('Error', err);
    console.log(`Server listening on port ${port}`);
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
