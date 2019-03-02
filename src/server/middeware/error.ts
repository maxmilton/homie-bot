import { IReq, IRes } from '../types';

/**
 * Handle errors and end the request.
 */
export function error(req: IReq, res: IRes): void {
  res.error = (err: Error, origin = ''): void => {
    // eslint-disable-next-line no-param-reassign
    err.message = origin ? `${origin} ${err.message}` : err.message;

    // eslint-disable-next-line no-console
    console.error(err);

    if (err.origMessage) {
      // eslint-disable-next-line no-console
      console.error(err.origMessage);
    }

    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err.message }));
  };
}
