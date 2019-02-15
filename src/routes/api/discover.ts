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
    // TODO: Change all server console statements to be like this one
    console.error('[API/DISCOVER] Error', err);

    // FIXME: Figure out what the correct err.message is for no devices discovered
    // if (err.message === '????') {
    //   // no devices found so respond with an empty array
    //   res.end('[]');
    //   return;
    // }

    res.statusCode = 500;

    if (err.message.startsWith('send ENETUNREACH')) {
      // FIXME: This error message is not displayed on the web client
      res.end('Network on server is unreachable.');
      return;
    }

    res.end();
  }
}
