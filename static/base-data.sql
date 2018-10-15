CREATE TABLE devices (
  host TEXT NOT NULL,
  port INTERGER NOT NULL,
  name TEXT NOT NULL,
  state TEXT,
  type INTERGER NOT NULL
);

CREATE TABLE presets (
  type TEXT NOT NULL,
  value TEXT NOT NULL
);

INSERT INTO presets (type, value)
VALUES
  ('color', '{"color":"#FF0000","name":"Red"}'),
  ('color', '{"color":"#00FF00","name":"Green"}'),
  ('color', '{"color":"#0000FF","name":"Blue"}'),
  ('color', '{"color":"#FFFFFF","name":"White"}');
