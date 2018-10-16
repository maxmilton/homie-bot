// https://github.com/samuraitruong/yeelight/blob/master/src/yeelight.ts

/* tslint:disable no-console */

import colorConvert from 'color-convert';
import * as yl from 'yeelight-awesome';
import * as dbMethods from '../db';

const TRANSITION_SPEED = 1000;

export function discoverDevices() {
  return new Promise((resolve, reject) => {
    const discover = new yl.Discover({
      port: 1982,
      // debug: true,
    });

    discover
      .start()
      .then(resolve, reject)
      .then(() => discover.destroy());
  });
}

/**
 * Run a one-shot command on a device; connect, run a command, then disconnect.
 */
export function oneShotCommand(id: string): Promise<yl.IDevice> {
  return new Promise((resolve, reject) => {
    let yeelight: yl.IDevice;

    try {
      const device = dbMethods.deviceGet(id);

      if (!device) throw new Error('Device not found in database.');

      yeelight = new yl.Yeelight({
        lightIp: device.host,
        lightPort: device.port,
      });

      yeelight.on('connected', () => {
        yeelight.on('commandSuccess', yeelight.disconnect);

        resolve({ yeelight, device });
      });

      yeelight.connect();
    } catch (err) {
      if (yeelight) yeelight.disconnect();
      reject(err);
    }
  });
}

/**
 * Get device info.
 */
export async function getInfo(id: string) {
  try {
    const { yeelight, device } = await oneShotCommand(id);
    const cmd = await yeelight.getProperty([
      yl.DevicePropery.POWER,
      yl.DevicePropery.BRIGHT,
      yl.DevicePropery.HUE,
      yl.DevicePropery.SAT,
    ]);
    const { result } = cmd.result;

    return {
      ...device,
      brightness: result[1],
      color: `#${colorConvert.hsv.hex([result[2], result[3], 100])}`,
      on: result[0] === 'on',
    };
  } catch (err) {
    console.error(err);
  }
}

/**
 * Toggle the device on or off.
 */
export async function toggle(id: string) {
  try {
    const { yeelight } = await oneShotCommand(id);
    return yeelight.toggle();
  } catch (err) {
    console.error(err);
  }
}

/**
 * Set the device brightness.
 */
export async function brightness(
  id: string,
  value: number | string,
  speed: number | string = TRANSITION_SPEED,
) {
  try {
    const { yeelight } = await oneShotCommand(id);
    return yeelight.setBright(+value, 'smooth', +speed);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Set the device hue colour.
 */
export async function color(id: string, value: string, speed: number | string = TRANSITION_SPEED) {
  try {
    const [hue, saturation] = colorConvert.hex.hsv(value);
    const { yeelight } = await oneShotCommand(id);
    return yeelight.setHSV(hue, saturation, 'smooth', +speed);
  } catch (err) {
    console.error(err);
  }
}
