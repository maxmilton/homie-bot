import { Store } from 'svelte/store.js'; // eslint-disable-line import/no-extraneous-dependencies

class AppStore extends Store {
  async discover() {
    const res = await fetch('/api/discover');

    if (!res.ok) throw new Error(res.statusText);

    this.set({ discovered: await res.json() });
  }

  async deviceGet(id) {
    const res = await fetch(`/api/device${id ? `/${id}` : ''}`);

    if (!res.ok) throw new Error(res.statusText);

    const devices = (await res.json()).map((device) => {
      /* eslint-disable-next-line no-param-reassign */
      device.state = JSON.parse(device.state);
      return device;
    });

    this.set({ devices });
  }

  async devicePut(id, data) {
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

  async deviceDelete(id) {
    const res = await fetch(`/api/device/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // update list of devices
    this.deviceGet();
  }

  async dbQuery(sql) {
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
  result: '',
};

export const server = req => new AppStore(initialState);

export const client = data => new AppStore(data);
