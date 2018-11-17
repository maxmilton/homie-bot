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
  body: object;
}

export interface IRes extends ServerResponse {
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
