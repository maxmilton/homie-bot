import * as dbMethods from '../../../../server/db';
import { IReq, IRes } from '../../../../server/types';

/**
 * Get a color preset.
 */
export function get(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.presetGet(req.params.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/color/:id]');
  }
}

/**
 * Modify an existing color preset.
 */
export function put(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.presetPut(req.params.id, 'color', req.body);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/color/:id]');
  }
}

/**
 * Remove a color preset.
 */
export function del(req: IReq, res: IRes): void {
  try {
    const result = dbMethods.presetDelete(req.params.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/color/:id]');
  }
}
