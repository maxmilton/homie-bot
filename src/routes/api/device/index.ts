import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Get a list of all device data.
 */
export function get(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.deviceList();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device]');
  }
}

/**
 * Add a new device.
 */
export function put(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.devicePut(null, req.body);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device]');
  }
}
