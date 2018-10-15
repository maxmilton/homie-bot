import { Req, Res } from '../../../../server/types.js';
import * as dbMethods from '../../../../server/db.js';

/**
 * Get a list of all color presets.
 */
export function get(req: Req, res: Res) {
  const result = dbMethods.presetList('color');

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Add a new color preset.
 */
export function put(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetPut(null, 'color', req.body)));
}
