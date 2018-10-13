// https://github.com/sveltejs/sapper/blob/master/templates/src/server/middleware/types.ts

import { ClientRequest, ServerResponse } from 'http';
// import * as yl from 'yeelight-awesome';

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

export type Device = {
  host: string;
  port: number;
  name: string;
  type: number;
  state: object;
};

// export type CommandCallback = (yeelight: yl.IDevice) => void;
