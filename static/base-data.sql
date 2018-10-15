CREATE TABLE devices(
  host TEXT NOT NULL,
  port INTERGER NOT NULL,
  name TEXT NOT NULL,
  state TEXT,
  type INTERGER NOT NULL
);

CREATE TABLE presets(
  type TEXT NOT NULL,
  value TEXT NOT NULL,
);
