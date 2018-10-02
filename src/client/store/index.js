import { Store } from 'svelte/store.js'; // eslint-disable-line import/no-extraneous-dependencies

class AppStore extends Store {
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

  async devicePut(data, id) {
    // inject default data
    if (!data.state) {
      /* eslint-disable-next-line no-param-reassign */
      data.state = { on: false };
    }

    /* eslint-disable-next-line no-param-reassign */
    id = id || data.rowid;

    const res = await fetch(`/api/device${id ? `/${id}` : ''}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error(res.statusText);

    // get the new list of devices
    this.deviceGet();
  }

  async deviceDelete(id) {
    const res = await fetch(`/api/device/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error(res.statusText);

    // get the new list of devices
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
    console.log('DB QUERY RESULT:', result);
    this.set({ result });
  }

  async dbReset() {
    const res = await fetch('/api/db/reset');

    if (!res.ok) throw new Error(res.statusText);

    // get the new list of devices
    this.deviceGet();
  }
}

const store = new AppStore({
  devices: [],
  result: '',
});

// store.on('state', ({ changed, current, previous }) => {
//   // console.log('## ON STATE', { changed, current, previous });

//   if (!previous.devices.length) return;
//   console.log('## ON STATE', current.devices[0].state, previous.devices[0].state);

//   if (changed.devices) {
//     current.devices.forEach((device, index) => {
//       const curr = JSON.stringify(device);
//       const prev = JSON.stringify(previous.devices[index]);
//       console.log('!! !==', curr !== prev);
//       console.log('@@ CURR', device.state);
//       console.log('@@ PREV', previous.devices[index] && previous.devices[index].state);
//       console.log('!! CURR', curr);
//       console.log('!! PREV', prev);

//       if (curr !== prev) {
//         console.log('!! HIT HIT HIT');
//         // console.log('!! CURR', curr);
//         // console.log('!! PREV', prev);

//         store.devicePut(device);
//       }
//     });
//   }
// });

export default store;
