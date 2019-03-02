// https://github.com/sveltejs/sapper/blob/master/src/interfaces.ts
// https://github.com/sveltejs/sapper/blob/master/templates/src/server/middleware/types.ts

import { ClientRequest, ServerResponse } from 'http';

export interface IReq extends ClientRequest {
  url: string;
  baseUrl: string;
  originalUrl: string;
  method: string;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
  headers: Record<string, string>;
  rawBody: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}

export interface IRes extends ServerResponse {
  error: (err: Error, origin?: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  write: (data: any) => void;
}

export { ServerResponse };

export type Next = () => void;

export interface IDevice {
  rowid?: string;
  host: string;
  port: number;
  name?: string;
  type?: number;
  state?: object | string;
}

interface IPreset {
  rowid?: string;
  type: string;
  value: string | object;
}

export interface IPresetColor extends IPreset {
  type: 'color';
  value: {
    color: string;
    name?: string;
  };
}
