<!--

  TODO: Add way to edit device name, host, port, etc.

  TODO: Ability to remove colour presets

  TODO: Add nice colour picker

  TODO: Add scheduled events

  TODO: Nice brightness slider input

  TODO: Preset flows (flow colours, sunrise, sunset) + allow scheduling them

-->

<svelte:head>
  <title>{name} | Homie Bot</title>
</svelte:head>

<h1 class="mb1">{name}</h1>

<div class="code">{host}:{port}</div>

<div class="form-group mt4">
  <Switch bind:value="on" on:change="toggle()" />
</div>

<div class="form-group">
  <label class="label">Presets</label>
  {#each $colors as color}
    <button
      class="button button-color ttu"
      style="border-color:{color.data.color};"
      type="button"
      on:click="setColor(color.data.color)"
    >
      {color.data.name}
    </button>
  {:else}
    <p>No color presets found.</p>
  {/each}
</div>

<div class="form-group mt4">
  <label class="label" for="color">Color{' '}<span class="muted">({color})</span></label>
  <input bind:value="color" class="input color pa0" type="color" id="color" on:change="setColor()">
  <input bind:value="colorName" class="input input-mini" type="text" placeholder="{color}">
  <button class="button" type="button" on:click="savePresetColor()">Save</button>
</div>

<div class="form-group mt4">
  <datalist id="tickmarks">
    <option value="1" label="1%">
    <option value="10">
    <option value="20">
    <option value="30">
    <option value="40">
    <option value="50" label="50%">
    <option value="60">
    <option value="70">
    <option value="80">
    <option value="90">
    <option value="100" label="100%">
  </datalist>

  <label class="label" for="brightness">Brightness{' '}<span class="muted">({brightness}%)</span></label>
  <input bind:value="brightness" class="range" type="range" list="tickmarks" on:change="setBrightness()">
</div>

<button
  class="button button-clear red3"
  type="button"
  on:click="deviceDelete(params.id)"
>
  Delete Device
</button>

<script>
  import { Switch } from 'minna-ui';
  import * as sapper from '../../../__sapper__/client.js'; // eslint-disable-line import/namespace

  export default {
    components: {
      Switch,
    },
    data: () => ({
      colorName: '',
    }),
    oncreate() {
      // get colour presets
      this.store.presetColorGet();
    },
    methods: {
      async toggle() {
        const { id } = this.get().params;
        const res = await fetch(`/api/command/${id}?action=toggle`);
        if (!res.ok) throw new Error(res.statusText);
      },

      async setBrightness() {
        const { params: { id }, brightness } = this.get();
        const res = await fetch(`/api/command/${id}?action=brightness&value=${brightness}`);
        if (!res.ok) throw new Error(res.statusText);
      },

      async setColor(value) {
        const { params: { id }, color } = this.get();
        let hex = value || color;
        hex = hex[0] === '#' ? hex.slice(1) : hex;

        // update UI with new colour
        if (value) this.set({ color: value });

        const res = await fetch(`/api/command/${id}?action=color&value=${hex}`);

        if (!res.ok) throw new Error(res.statusText);
      },

      savePresetColor() {
        try {
          const { color, colorName } = this.get();
          const name = colorName || color;

          this.store.presetColorPut(null, { color, name });
        } catch (err) {
          // TODO: Handle error better
          console.error(err);
        }
      },

      async deviceDelete(id) {
        try {
          await this.store.deviceDelete(id);
          sapper.goto('/');
        } catch (err) {
          // TODO: Handle error better
          console.error(err);
        }
      },
    },

    async preload({ params }) {
      const res = await this.fetch(`/api/device/info/${params.id}`);

      if (!res.ok) throw new Error(res.statusText);

      return res.json();
    },
  };
</script>

<style type="text/postcss">
  @import 'import.css';

  .button-color {
    padding-left: calc($button-padding-x - 0.25em);
    border-left: 1em solid;
  }

  .color {
    width: 7em;
    height: 2.25em;
    vertical-align: top;
  }

  .input-mini {
    max-width: 10em;
  }

  .range {
    width: 100%;
  }
</style>
