// global CSS must come first
import './css/main.css';

import store from './store';
import App from './App.html';

new App({ // eslint-disable-line no-new
  target: document.body,
  store,
});
