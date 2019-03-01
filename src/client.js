// global CSS
import './css/main.css';

import * as sapper from '@sapper/app'; // eslint-disable-line

sapper.start({
  target: document.getElementById('sapper'),
});
