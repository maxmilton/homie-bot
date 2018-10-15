import { Req, Res } from '../../../../server/types.js';
import * as dbMethods from '../../../../server/db.js';

/**
 * Get a color preset.
 */
export function get(req: Req, res: Res) {
  const result = dbMethods.presetGet(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Modify an existing color preset.
 */
export function put(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetPut(req.params.id, 'color', req.body)));
}

/**
 * Remove a color preset.
 */
export function del(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetDelete(req.params.id)));
}
