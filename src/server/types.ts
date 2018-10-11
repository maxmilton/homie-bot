// https://github.com/sveltejs/sapper/blob/master/templates/src/server/middleware/types.ts

import { ClientRequest, ServerResponse } from 'http';

export interface Req extends ClientRequest {
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

export interface Res extends ServerResponse {
  write: (data: any) => void;
}

export { ServerResponse };

export type Next = () => void;

export type DeviceData = {
  ip: string;
  name: string;
  type: number;
  state: object;
};
