import * as yeelight from '../../server/plugins/yeelight.js';
import { IReq, IRes } from '../../server/types.js';

/**
 * Find devices on the local network.
 */
export async function get(req: IReq, res: IRes) {
  try {
    const result = await yeelight.discoverDevices();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('Error', err); // tslint:disable-line no-console
    res.statusCode = 500;
    res.end();
  }
}
