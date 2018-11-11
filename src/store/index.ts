/* tslint:disable no-console */

/* tslint:disable-next-line no-submodule-imports no-implicit-dependencies */
import { Store } from 'svelte/store.js';
import { IDevice, IPresetColor, IReq } from '../server/types';

class AppStore extends Store {
  public async discover() {
    const res = await fetch('/api/discover');

    if (!res.ok) throw new Error(res.statusText);

    const discovered = await res.json();
    this.set({ discovered });
  }

  public async devicePut(id: string | null, data: IDevice) {
    // inject default data
    const device = {...data, ...{
      state: data.state || {},
      type: data.type || -1,
    }};

    /* tslint:disable-next-line no-parameter-reassignment */
    id = id || data.rowid;

    const res = await fetch(`/api/device${id ? `/${id}` : ''}`, {
      body: JSON.stringify(device),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }

  public async deviceGet(id?: string) {
    const res = await fetch(`/api/device${id ? `/${id}` : ''}`);

    if (!res.ok) throw new Error(res.statusText);

    const devices = await res.json();
    this.set({ devices });
  }

  public async deviceDelete(id: string) {
    const res = await fetch(`/api/device/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }

  public async presetColorPut(id: string | null, data: IPresetColor) {
    /* tslint:disable-next-line no-parameter-reassignment */
    id = id || data.rowid;

    const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`, {
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of colours
    this.presetColorGet();
  }

  public async presetColorGet(id?: string) {
    const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`);

    if (!res.ok) throw new Error(res.statusText);

    const colors = await res.json();
    this.set({ colors });
  }

  public async presetColorDelete(id: string) {
    const res = await fetch(`/api/preset/color/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of colours
    this.presetColorGet();
  }

  public async dbQuery(sql: string) {
    const res = await fetch('/api/db/query', {
      body: JSON.stringify({ sql }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });

    if (!res.ok) throw new Error(res.statusText);

    const result = await res.json();
    console.log('[DB] QUERY RESULT:', result);
    this.set({ result });
  }

  public async dbReset() {
    const res = await fetch('/api/db/reset');

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }
}

const initialState = {
  colors: [],
  devices: [],
  discovered: [],
  result: '',
};

export const server = (req: IReq) => new AppStore(initialState);

export const client = data => new AppStore(data);
