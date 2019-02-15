// https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { IDevice } from './types';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'homie-bot.db');
const db = new Database(DB_PATH);

// use write-ahead logging mode for better performance
db.pragma('journal_mode = WAL');

/** Populate database with default data */
export function dbInit() {
  const hasTables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='devices'",
    )
    .get();

  if (hasTables) return;

  console.log('[DB] Database appears empty, initialising it.');
  const sql = fs.readFileSync(
    path.join(process.cwd(), './static/base-data.sql'),
    'utf8',
  );
  db.exec(sql);
}

// initialise database
dbInit();

/** Remove all database tables and populate with base data */
export function reset() {
  db.pragma('writable_schema = 1');
  db.exec(
    "DELETE FROM sqlite_master WHERE type in ('table', 'index', 'trigger')",
  );
  db.pragma('writable_schema = 0');
  db.exec('VACUUM'); // recover deleted space

  dbInit();
}

export function query(sql: string) {
  const stmt = db.prepare(sql);
  return stmt.reader ? stmt.all() : stmt.run();
}

const devicePutStmt = db.prepare(`
  INSERT OR REPLACE INTO devices (
    rowid,
    host,
    port,
    name,
    state,
    type
  )
  VALUES (
    @rowid,
    @host,
    @port,
    @name,
    json(@state),
    @type
  )
`);

export function devicePut(
  rowid: string | null,
  { host, port, name, state, type }: IDevice,
) {
  return devicePutStmt.run({
    host,
    name,
    port,
    rowid,
    type,
    state: JSON.stringify(state),
  });
}

const deviceGetStmt = db.prepare('SELECT rowid, * FROM devices WHERE rowid=?');

export function deviceGet(id: string) {
  const device = deviceGetStmt.get(id);
  device.state = JSON.parse(device.state);

  return device;
}

const deviceListStmt = db.prepare('SELECT rowid, * FROM devices');

export function deviceList() {
  const devices = deviceListStmt.all();
  return devices.map((device: IDevice) => {
    device.state = JSON.parse(device.state);

    return device;
  });
}

const deviceDeleteStmt = db.prepare('DELETE FROM devices WHERE rowid=?');

export function deviceDelete(id: string) {
  return deviceDeleteStmt.run(id);
}

const presetPutStmt = db.prepare(`
  INSERT OR REPLACE INTO presets (
    rowid,
    type,
    data
  )
  VALUES (
    @rowid,
    @type,
    json(@data)
  )
`);

export function presetPut(rowid: string | null, type: string, data: object) {
  return presetPutStmt.run({ rowid, type, data: JSON.stringify(data) });
}

const presetGetStmt = db.prepare('SELECT rowid, * FROM presets WHERE rowid=?');

export function presetGet(id: string) {
  const preset = presetGetStmt.get(id);
  preset.data = JSON.parse(preset.data);

  return preset;
}

const presetListTypeStmt = db.prepare(
  'SELECT rowid, * FROM presets WHERE type=?',
);
const presetListStmt = db.prepare('SELECT rowid, * FROM presets');

export function presetList(type?: string) {
  const presets = type ? presetListTypeStmt.all(type) : presetListStmt.all();

  return presets.map((preset) => {
    preset.data = JSON.parse(preset.data);

    return preset;
  });
}

const presetDeleteStmt = db.prepare('DELETE FROM presets WHERE rowid=?');

export function presetDelete(id: string) {
  return presetDeleteStmt.run(id);
}

export default db;
