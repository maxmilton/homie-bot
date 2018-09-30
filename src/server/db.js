// https://github.com/JoshuaWise/better-sqlite3/wiki/API

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

// TODO: Place DB in a location where it doesn't get removed on each build
const db = new Database(path.join(__dirname, 'home-control.db'));

// use write-ahead logging mode for better performance
db.pragma('journal_mode = WAL');

/** Populate database with default data */
export function dbInit() {
  const hasTables = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type='table' AND name='devices'
  `).get();

  if (!hasTables) {
    console.log('WARNING: Database appears empty; initialising it.');
    const sql = fs.readFileSync(path.join(__dirname, './base-data.sql'), 'utf8');
    db.exec(sql);
  }
}

// initialise database
dbInit();

/** Remove all database tables and populate with base data */
export function reset() {
  db.pragma('writable_schema = 1');
  db.exec("DELETE FROM sqlite_master WHERE type in ('table', 'index', 'trigger')");
  db.pragma('writable_schema = 0');
  // recover deleted space
  db.exec('VACUUM');

  dbInit();
}

export function query(sql) {
  const stmt = db.prepare(sql);
  return stmt.returnsData
    ? stmt.all()
    : stmt.run();
}

const devicePutStmt = db.prepare(`
  INSERT OR REPLACE INTO devices(
    rowid,
    ip,
    name,
    type,
    state
  )
  VALUES (
    @rowid,
    @ip,
    @name,
    @type,
    json(@state)
  )
`);

export function devicePut({ ip, name, type, state }, rowid) {
  return devicePutStmt.run({ rowid, ip, name, type, state: JSON.stringify(state) });
}

const deviceGetStmt = db.prepare('SELECT rowid, * FROM devices WHERE rowid=?');

export function deviceGet(id) {
  return deviceGetStmt.get(id);
}

const deviceListStmt = db.prepare('SELECT rowid, * FROM devices');

export function deviceList() {
  return deviceListStmt.all();
}

const deviceDeleteStmt = db.prepare('DELETE FROM devices WHERE rowid=?');

export function deviceDelete(id) {
  return deviceDeleteStmt.run(id);
}

export default db;
