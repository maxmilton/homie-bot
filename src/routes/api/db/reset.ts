import * as dbMethods from '../../../server/db.js';
import { IReq, IRes } from '../../../server/types.js';

/**
 * Reset the database.
 */
export function get(req: IReq, res: IRes) {
  dbMethods.reset();
  res.end('OK');
}
