import * as dbMethods from '../../../server/db.js';
import { IReq, IRes } from '../../../server/types.js';

/**
 * Get a list of all device data.
 */
export function get(req: IReq, res: IRes) {
  const result = dbMethods.deviceList();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Add a new device.
 */
export function put(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(null, req.body)));
}
