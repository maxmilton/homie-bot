import { Req, Res } from './types';
import * as dbMethods from './db.js';
import * as yeelight from './plugins/yeelight.js';

/**
 * Run a command against a device.
 */
export function command(req: Req, res: Res) {
  switch (req.query.action) {
    case 'toggle':
      yeelight.toggle();
      break;

    case 'brightness':
      yeelight.brightness(req.query.value, +req.query.speed);
      break;

    case 'color':
      yeelight.color(req.query.hue, +req.query.saturation, +req.query.speed);
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
export async function discover(req: Req, res: Res) {
  try {
    const result = await yeelight.discover();

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end();
  }
}

/**
 * Get info directly from a device.
 */
export async function getDeviceInfo(req: Req, res: Res) {
  const result = await yeelight.getInfo();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Get a device or a list of all devices.
 */
export function getDevice(req: Req, res: Res) {
  const result = req.params.id
    ? dbMethods.deviceGet(req.params.id)
    : dbMethods.deviceList();

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
}

/**
 * Update an existing device or add a new one.
 */
export function putDevice(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.devicePut(req.body, req.params.id)));
}

/**
 * Remove a device.
 */
export function deleteDevice(req: Req, res: Res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(dbMethods.deviceDelete(req.params.id)));
}

/**
 * Run an SQL query against the database.
 */
export function postDbQuery(req: Req, res: Res) {
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
export function getDbReset(req: Req, res: Res) {
  dbMethods.reset();
  res.end('OK');
}
