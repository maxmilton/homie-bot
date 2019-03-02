import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Get device data.
 */
export function get(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.deviceGet(req.params.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device/:id]');
  }
}

/**
 * Update an existing device.
 */
export function put(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.devicePut(req.params.id, req.body);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device/:id]');
  }
}

/**
 * Remove a device.
 */
export function del(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.deviceDelete(req.params.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device/:id]');
  }
}
