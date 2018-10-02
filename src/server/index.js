import sirv from 'sirv';
import polka from 'polka';
import * as colors from 'colorette';
import { log, parse } from './middleware.js';
import * as routes from './routes.js';
import db from './db.js';

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
  .all('/api/command', routes.command)
  .get('/api/discover', routes.discover)
  // .get('/api/device/info/:id', routes.getDeviceInfo) // TODO: Use this form where the id is mandatory
  .get('/api/device/info/:id?', routes.getDeviceInfo)
  .get('/api/device/:id?', routes.getDevice)
  .put('/api/device/:id?', routes.putDevice)
  .delete('/api/device/:id', routes.deleteDevice)
  .post('/api/db/query', routes.postDbQuery)
  .get('/api/db/reset', routes.getDbReset)

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
