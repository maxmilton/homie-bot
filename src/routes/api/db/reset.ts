import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Reset the database.
 */
export function get(req: IReq, res: IRes): void {
  dbMethods.reset();
  res.end('OK');
}
