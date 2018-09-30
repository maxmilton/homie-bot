import * as dbMethods from './db.js';

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
export function getDbReset(req, res) {
  dbMethods.reset();
  res.end('OK');
}
