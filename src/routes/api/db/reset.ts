import { Req, Res } from '../../../server/types.js';
import * as dbMethods from '../../../server/db.js';

/**
 * Reset the database.
 */
export function get(req: Req, res: Res) {
  dbMethods.reset();
  res.end('OK');
}
