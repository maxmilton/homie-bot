import * as dbMethods from '../../../../server/db.js';
import { IReq, IRes } from '../../../../server/types.js';

/**
 * Get a list of all color presets.
 */
export function get(req: IReq, res: IRes) {
  const result = dbMethods.presetList('color');

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Add a new color preset.
 */
export function put(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetPut(null, 'color', req.body)));
}
