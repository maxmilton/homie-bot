import { Req, Res } from '../../../server/types.js';
import * as dbMethods from '../../../server/db.js';

/**
 * Get a list of all device data.
 */
export function get(req: Req, res: Res) {
  const result = dbMethods.deviceList();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Add a new device.
 */
export function put(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(null, req.body)));
}
