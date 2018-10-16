import * as dbMethods from '../../../server/db.js';
import { IReq, IRes } from '../../../server/types.js';

/**
 * Get device data.
 */
export function get(req: IReq, res: IRes) {
  const result = dbMethods.deviceGet(req.params.id);

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Update an existing device.
 */
export function put(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(req.params.id, req.body)));
}

/**
 * Remove a device.
 */
export function del(req: IReq, res: IRes) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.deviceDelete(req.params.id)));
}
