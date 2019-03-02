import * as yeelight from '../../../../server/plugins/yeelight';
import { IReq, IRes } from '../../../../server/types';

/**
 * Get info directly from a device.
 */
export async function get(req: IReq, res: IRes): Promise<void> {
  try {
    const result = await yeelight.getInfo(req.params.id);

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    res.error(err, '[api/device/info/:id]');
  }
}
