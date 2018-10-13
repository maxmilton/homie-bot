// global CSS must come first
import './css/main.css';

import * as store from './store';
import * as sapper from '../__sapper__/client.js'; // eslint-disable-line import/namespace

sapper.start({
  target: document.getElementById('sapper'),
  store: store.client,
});
