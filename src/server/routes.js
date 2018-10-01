import * as dbMethods from './db.js';
import * as yeelight from './plugins/yeelight.js';

/**
 * Run a command against a device.
 */
export function command(req, res) {
  switch (req.query.action) {
    case 'toggle':
      yeelight.toggle();
      break;

    case 'brightness':
      yeelight.brightness(req.query.value, req.query.speed);
      break;

    case 'color':
      yeelight.color(req.query.hue, req.query.saturation, req.query.speed);
      break;

    default:
      break;
  }

  // FIXME: Use the yeelight package for this; remove mock data
  const result = { ok: true };

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Find devices on the local network.
 */
export function discover(req, res) {
  // FIXME: Use the yeelight package for this; remove mock data
  const result = [];

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Get info directly from a device.
 */
export async function getDeviceInfo(req, res) {
  const result = await yeelight.getInfo();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Get a device or a list of all devices.
 */
export function getDevice(req, res) {
  const result = req.params.id
    ? dbMethods.deviceGet(req.params.id)
    : dbMethods.deviceList();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Update an existing device or add a new one.
 */
export function putDevice(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(req.body, req.params.id)));
}

/**
 * Remove a device.
 */
export function deleteDevice(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.deviceDelete()));
}

/**
 * Run an SQL query against the database.
 */
export function postQuery(req, res) {
  if (req.body && req.body.sql) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(dbMethods.query(req.body.sql)));
  } else {
    res.statusCode = 400;
    res.end();
  }
}

/**
 * Reset the database.
 */
export function getReset(req, res) {
  dbMethods.reset();
  res.end('OK');
}
