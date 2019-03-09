import { writable } from 'svelte/store';
import { IDevice, IPresetColor } from '../server/types';

export const colors = writable([]);
export const devices = writable([]);
export const discovered = writable([]);
export const result = writable('');

// expose the stores globally for easy debugging
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.store = {
      colors,
      devices,
      discovered,
      result,
    };
  }
}

export async function discover(): Promise<void> {
  const res = await fetch('/api/discover');

  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();
  discovered.set(data);
}

export async function deviceGet(id?: string): Promise<void> {
  const res = await fetch(`/api/device${id ? `/${id}` : ''}`);

  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();
  devices.set(data);
}

export async function devicePut(id: string | null, data: IDevice): Promise<void> {
  // inject default data
  const device = {
    ...data,
    state: data.state || {},
    type: data.type || -1,
  };

  // eslint-disable-next-line no-param-reassign
  id = id || data.rowid;

  const res = await fetch(`/api/device${id ? `/${id}` : ''}`, {
    body: JSON.stringify(device),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });

  if (!res.ok) throw new Error(res.statusText);

  // update list of devices
  deviceGet();
}

export async function deviceDelete(id: string): Promise<void> {
  const res = await fetch(`/api/device/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(res.statusText);

  // update list of devices
  deviceGet();
}

export async function presetColorGet(id?: string): Promise<void> {
  const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`);

  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();
  colors.set(data);
}

export async function presetColorPut(id: string | null, data: IPresetColor): Promise<void> {
  // eslint-disable-next-line no-param-reassign
  id = id || data.rowid;

  const res = await fetch(`/api/preset/color${id ? `/${id}` : ''}`, {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
    method: 'PUT',
  });

  if (!res.ok) throw new Error(res.statusText);

  // update list of colours
  presetColorGet();
}

export async function presetColorDelete(id: string): Promise<void> {
  const res = await fetch(`/api/preset/color/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error(res.statusText);

  // update list of colours
  presetColorGet();
}

export async function dbQuery(sql: string): Promise<void> {
  const res = await fetch('/api/db/query', {
    body: JSON.stringify({ sql }),
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
  });

  if (!res.ok) throw new Error(res.statusText);

  const data = await res.json();

  // eslint-disable-next-line no-console
  console.log('[DB] QUERY RESULT:', data);

  result.set(data);
}

export async function dbReset(): Promise<void> {
  const res = await fetch('/api/db/reset');

  if (!res.ok) throw new Error(res.statusText);

  // update list of devices
  deviceGet();
}
