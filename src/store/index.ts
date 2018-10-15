import { Store } from 'svelte/store.js';
import { Device, PresetColor, Req } from '../server/types';

class AppStore extends Store {
  async discover() {
    const res = await fetch('/api/discover');

    if (!res.ok) throw new Error(res.statusText);

    this.set({ discovered: await res.json() });
  }

  async devicePut(id: string | null, data: Device) {
    // inject default data
    const device = Object.assign({}, data, {
      state: data.state || {},
      type: data.type || -1,
    });

    /* eslint-disable-next-line no-param-reassign */
    id = id || data.rowid;

    const res = await fetch(`/api/device${id ? `/${id}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(device),
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }

  async deviceGet(id?: string) {
    const res = await fetch(`/api/device${id ? `/${id}` : ''}`);

    if (!res.ok) throw new Error(res.statusText);

    const devices = (await res.json()).map((device: Device) => {
      /* eslint-disable-next-line no-param-reassign */
      device.state = JSON.parse(device.state);
      return device;
    });

    this.set({ devices });
  }

  async deviceDelete(id: string) {
    const res = await fetch(`/api/device/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }

  async presetColorPut(id: string | null, data: PresetColor) {
    /* eslint-disable-next-line no-param-reassign */
    id = id || data.rowid;

    const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of colours
    this.presetColorGet();
  }

  async presetColorGet(id?: string) {
    const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`);

    if (!res.ok) throw new Error(res.statusText);

    const colors = (await res.json()).map((color: PresetColor) => {
      /* eslint-disable-next-line no-param-reassign */
      color.value = JSON.parse(color.value);
      return color;
    });

    this.set({ colors });
  }

  async presetColorDelete(id: string) {
    const res = await fetch(`/api/preset/color/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of colours
    this.presetColorGet();
  }

  async dbQuery(sql: string) {
    const res = await fetch('/api/db/query', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ sql }),
    });

    if (!res.ok) throw new Error(res.statusText);

    const result = await res.json();
    console.log('[DB] QUERY RESULT:', result);
    this.set({ result });
  }

  async dbReset() {
    const res = await fetch('/api/db/reset');

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }
}

const initialState = {
  discovered: [],
  devices: [],
  colors: [],
  result: '',
};

export const server = (req: Req) => new AppStore(initialState);

export const client = data => new AppStore(data);
