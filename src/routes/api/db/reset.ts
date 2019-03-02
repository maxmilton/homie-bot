import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Reset the database.
 */
export function get(req: IReq, res: IRes): void {
  try {
    dbMethods.reset();
    res.end('OK');
  } catch (err) {
    res.error(err, '[api/db/reset]');
  }
}
