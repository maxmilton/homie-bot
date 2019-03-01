import * as yeelight from '../../../server/plugins/yeelight';
import { IReq, IRes } from '../../../server/types';

/**
 * Run a command against a device.
 */
function all(req: IReq, res: IRes): void {
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
