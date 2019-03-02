import * as yeelight from '../../server/plugins/yeelight';
import { IReq, IRes } from '../../server/types';

/**
 * Find devices on the local network.
 */
export async function get(req: IReq, res: IRes): Promise<void> {
  try {
    const result = await yeelight.discoverDevices();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    // FIXME: Figure out what the correct err.message is for no devices discovered
    // if (err.message === '????') {
    //   // no devices found so respond with an empty array
    //   res.end('[]');
    //   return;
    // }

    // use a more user friendly error message
    if (err.message.startsWith('send ENETUNREACH')) {
      err.origMessage = err.message;
      err.message = 'Network on server is unreachable';
    }

    res.error(err, '[api/discover]');
  }
}
