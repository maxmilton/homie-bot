import { Req, Res } from '../../../../server/types.js';
import * as yeelight from '../../../../server/plugins/yeelight.js';

/**
 * Get info directly from a device.
 */
export async function get(req: Req, res: Res) {
  const result = await yeelight.getInfo(req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}
