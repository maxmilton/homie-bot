import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Get a list of all device data.
 */
export function get(req: IReq, res: IRes): void {
  const result = dbMethods.deviceList();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Add a new device.
 */
export function put(req: IReq, res: IRes): void {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(null, req.body)));
}
