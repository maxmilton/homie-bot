import { Req, Res } from '../../../server/types.js';
import * as yeelight from '../../../server/plugins/yeelight.js';

/**
 * Run a command against a device.
 */
function all(req: Req, res: Res) {
  const { id } = req.params;
  const { action, speed, value } = req.query;
  let result;

  switch (action) {
    case 'toggle':
      result = yeelight.toggle(id);
      break;

    case 'brightness':
      result = yeelight.brightness(id, value, speed);
      break;

    case 'color':
      result = yeelight.color(id, value, speed);
      break;

    default:
      break;
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export const post = all;
export const get = all;
export const put = all;
export const patch = all;
export const del = all;
