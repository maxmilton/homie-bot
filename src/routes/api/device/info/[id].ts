import * as yeelight from '../../../../server/plugins/yeelight.js';
import { IReq, IRes } from '../../../../server/types.js';

/**
 * Get info directly from a device.
 */
export async function get(req: IReq, res: IRes) {
  const result = await yeelight.getInfo(req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}
