// https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { IDevice, IPreset } from './types';

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), '.db/homie-bot.db');
const db = new Database(DB_PATH);

// use write-ahead logging mode for better performance
db.pragma('journal_mode = WAL');

/** Populate database with default data */
export function dbInit(): void {
  const hasTables = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='devices'",
    )
    .get();

  if (hasTables) return;

  // eslint-disable-next-line no-console
  console.log('[DB] Database appears empty, initialising...');

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const sql = fs.readFileSync(
    path.join(process.cwd(), './static/base-data.sql'),
    'utf8',
  );
  db.exec(sql);
}

// initialise database
dbInit();

/** Remove all database tables and populate with base data */
export function reset(): void {
  db.pragma('writable_schema = 1');
  db.exec(
    "DELETE FROM sqlite_master WHERE type in ('table', 'index', 'trigger')",
  );
  db.pragma('writable_schema = 0');
  db.exec('VACUUM'); // recover deleted space

  dbInit();
}

export function query(sql: string): object[] | Database.RunResult {
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
): Database.RunResult {
  return devicePutStmt.run({
    host,
    name,
    port,
    rowid,
    state: JSON.stringify(state),
    type,
  });
}

const deviceGetStmt = db.prepare('SELECT rowid, * FROM devices WHERE rowid=?');

export function deviceGet(id: string): IDevice {
  const device = deviceGetStmt.get(id);
  device.state = JSON.parse(device.state);

  return device;
}

const deviceListStmt = db.prepare('SELECT rowid, * FROM devices');

export function deviceList(): IDevice[] {
  const devices = deviceListStmt.all();
  return devices.map((device: IDevice) => {
    try {
      // eslint-disable-next-line no-param-reassign
      device.state = JSON.parse(device.state);
    } catch (err) {
      // noop
    }

    return device;
  });
}

const deviceDeleteStmt = db.prepare('DELETE FROM devices WHERE rowid=?');

export function deviceDelete(id: string): Database.RunResult {
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

export function presetPut(
  rowid: string | null,
  type: string,
  data: object,
): Database.RunResult {
  return presetPutStmt.run({ data: JSON.stringify(data), rowid, type });
}

const presetGetStmt = db.prepare('SELECT rowid, * FROM presets WHERE rowid=?');

export function presetGet(id: string): IPreset {
  const preset = presetGetStmt.get(id);
  preset.data = JSON.parse(preset.data);

  return preset;
}

const presetListTypeStmt = db.prepare(
  'SELECT rowid, * FROM presets WHERE type=?',
);
const presetListStmt = db.prepare('SELECT rowid, * FROM presets');

export function presetList(type?: string): IPreset[] {
  const presets = type ? presetListTypeStmt.all(type) : presetListStmt.all();

  return presets.map((preset) => {
    try {
      // eslint-disable-next-line no-param-reassign
      preset.data = JSON.parse(preset.data);
    } catch (err) {
      // noop
    }

    return preset;
  });
}

const presetDeleteStmt = db.prepare('DELETE FROM presets WHERE rowid=?');

export function presetDelete(id: string): Database.RunResult {
  return presetDeleteStmt.run(id);
}

export default db;
