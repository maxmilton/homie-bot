import { Req, Res } from '../../../server/types.js';
import * as dbMethods from '../../../server/db.js';

/**
 * Run an SQL query against the database.
 */
export function post(req: Req, res: Res) {
  if (req.body && req.body.sql) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dbMethods.query(req.body.sql)));
  } else {
    res.statusCode = 400;
    res.end();
  }
}
