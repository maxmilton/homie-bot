import * as dbMethods from '../../../server/db.js';
import { IReq, IRes } from '../../../server/types.js';

/**
 * Run an SQL query against the database.
 */
export function post(req: IReq, res: IRes) {
  if (req.body && req.body.sql) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dbMethods.query(req.body.sql)));
  } else {
    res.statusCode = 400;
    res.end();
  }
}
