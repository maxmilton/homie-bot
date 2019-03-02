import * as dbMethods from '../../../../server/db';
import { IReq, IRes } from '../../../../server/types';

/**
 * Get a list of all color presets.
 */
export function get(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.presetList('color');

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/color]');
  }
}

/**
 * Add a new color preset.
 */
export function put(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.presetPut(null, 'color', req.body);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/color]');
  }
}
