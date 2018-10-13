import { Req, Res } from '../../server/types.js';
import * as yeelight from '../../server/plugins/yeelight.js';

/**
 * Find devices on the local network.
 */
export async function get(req: Req, res: Res) {
  try {
    const result = await yeelight.discover();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error('Error', err);
    res.statusCode = 500;
    res.end();
  }
}
