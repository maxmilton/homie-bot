// https://github.com/samuraitruong/yeelight/blob/master/src/yeelight.ts

import * as yl from 'yeelight-awesome';

const TRANSITION_SPEED = 1000;

export function discover() {
  return new Promise((resolve, reject) => {
    const discover = new yl.Discover({ port: 1982 });

    // FIXME: Returns duplicate devices
    discover
      .start()
      .then(resolve, reject)
      .then(() => discover.destroy());
  });
}

// const devices = discover();

/**
 * Run a one-shot command on a device; connect, run a command, then disconnect.
 * @param {Function} cb Callback function to run on the device.
 */
export async function oneShotCommand(device, cb: Function): yl.IDevice {
  // const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: device.host,
    lightPort: device.port,
  });

  yeelight.on('connected', () => {
    yeelight.on('commandSuccess', yeelight.disconnect);

    cb(yeelight);
  });

  yeelight.connect();
}

/**
 * Get device info.
 * @returns {object}
 */
export function getInfo() {
  // return device;
}

/**
 * Toggle the device on or off.
 */
export function toggle() {
  oneShotCommand((yeelight) => {
    yeelight.toggle();
  });
}

/**
 * Set the device brightness.
 * @param {number} value Brightness value from 1 to 100.
 * @param {number=} speed Time in ms for transition speed,
 */
export function brightness(value, speed = TRANSITION_SPEED) {
  oneShotCommand((yeelight) => {
    yeelight.setBright(+value, 'smooth', speed);
  });
}

/**
 * Set the device hue colour.
 * @param {number} hue Colour value from 0 to 359.
 * @param {number=} saturation Saturation value from 0 to 100.
 * @param {number=} speed Time in ms for transition speed,
 */
export function color(hue: number, saturation = 100, speed = TRANSITION_SPEED) {
  oneShotCommand((yeelight) => {
    yeelight.setHSV(hue, saturation, 'smooth', speed);
  });
}
