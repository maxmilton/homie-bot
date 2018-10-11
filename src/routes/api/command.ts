import { Req, Res } from '../../server/types.js';
import * as yeelight from '../../server/plugins/yeelight.js';

/**
 * Run a command against a device.
 */
function all(req: Req, res: Res) {
  switch (req.query.action) {
    case 'toggle':
      yeelight.toggle();
      break;

    case 'brightness':
      yeelight.brightness(req.query.value, +req.query.speed);
      break;

    case 'color':
      yeelight.color(req.query.hue, +req.query.saturation, +req.query.speed);
      break;

    default:
      break;
  }

  // FIXME: Use the yeelight package for this; remove mock data
  const result = { ok: true };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

export const post = all;
export const get = all;
export const put = all;
export const patch = all;
export const del = all;
