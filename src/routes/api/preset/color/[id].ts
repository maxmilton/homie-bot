import * as dbMethods from '../../../../server/db.js';
import { IReq, IRes } from '../../../../server/types.js';

/**
 * Get a color preset.
 */
export function get(req: IReq, res: IRes) {
  const result = dbMethods.presetGet(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Modify an existing color preset.
 */
export function put(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetPut(req.params.id, 'color', req.body)));
}

/**
 * Remove a color preset.
 */
export function del(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.presetDelete(req.params.id)));
}
