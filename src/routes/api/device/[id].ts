import { Req, Res } from '../../../server/types.js';
import * as dbMethods from '../../../server/db.js';

/**
 * Get device data.
 */
export function get(req: Req, res: Res) {
  const result = dbMethods.deviceGet(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Update an existing device.
 */
export function put(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(req.params.id, req.body)));
}

/**
 * Remove a device.
 */
export function del(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.deviceDelete(req.params.id)));
}
