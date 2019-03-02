import * as dbMethods from '../../../server/db';
import { IReq, IRes } from '../../../server/types';

/**
 * Run an SQL query against the database.
 */
export function post(req: IReq, res: IRes): void {
  try {
    if (req.body && req.body.sql) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(dbMethods.query(req.body.sql)));
    } else {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing "sql" field' }));
    }
  } catch (err) {
    res.error(err, '[api/db/query]');
  }
}
