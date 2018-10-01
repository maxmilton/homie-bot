// https://github.com/samuraitruong/yeelight/blob/master/src/yeelight.ts

import yl from 'yeelight-awesome';

const TRANSITION_SPEED = 1000;

function getDevice() {
  return new Promise((resolve) => {
    const discover = new yl.Discover({
      port: 1982,
      debug: true,
    });

    discover.once('deviceAdded', resolve);

    discover
      .start()
      .catch(console.error.bind(console))
      .then(() => discover.destroy());
  });
}

const device = getDevice();

/**
 * Run a one-shot command on a device; connect, run a command, then disconnect.
 * @param {Function} cb Callback function to run on the device.
 */
export async function oneShotCommand(cb) {
  const light = await device;

  const yeelight = new yl.Yeelight({
    lightIp: light.host,
    lightPort: light.port,
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
  return device;
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
  // FIXME: This is not working
  oneShotCommand((yeelight) => {
    // console.log('## DEVICE', device);
    // console.log('## BRIGHTNESS', value, 'smooth', speed);

    // yeelight.on('set_bright', yeelight.disconnect);
    yeelight.setBright(value, 'smooth', speed);
  });
}

/**
 * Set the device hue colour.
 * @param {number} hue Colour value from 0 to 359.
 * @param {number=} saturation Saturation value from 0 to 100.
 * @param {number=} speed Time in ms for transition speed,
 */
export function color(hue, saturation = 100, speed = TRANSITION_SPEED) {
  // FIXME: This is not working
  oneShotCommand((yeelight) => {
    // console.log('## DEVICE', device);
    // console.log('## COLOR', hue, saturation, 'smooth', speed);

    // yeelight.on('set_hsv', yeelight.disconnect);
    yeelight.setHSV(hue, saturation, 'smooth', speed);
  });
}
