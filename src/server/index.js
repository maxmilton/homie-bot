import sirv from 'sirv';
import polka from 'polka';
import * as colors from 'colorette';
import { bodyParse, log } from './middleware.js';
import * as routes from './routes.js';
import db from './db.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const port = PORT || 5000;

polka()
  .use(
    log,
    sirv('dist/client', { dev }),
    bodyParse,
  )
  .get('/api/device/:id?', routes.getDevice)
  .put('/api/device/:id?', routes.putDevice)
  .delete('/api/device/:id', routes.deleteDevice)
  .post('/api/query', routes.postQuery)
  .get('/api/reset', routes.getDbReset)
  .listen(port, (err) => {
    if (err) console.error(colors.bgRedBright(colors.white('Error')), err);
    console.log(`Server listening on port ${port}`);
  });

// clean up and close database connection on exit
process.on('SIGINT', () => {
  console.log(colors.yellowBright('\nServer shutting down...'));

  try {
    db.close();
    console.log('Server terminated');
    process.exit(0);
  } catch (err) {
    console.error(colors.bgRedBright(colors.white('Error')), err);
    process.exit(1);
  }
});
