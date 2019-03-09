<!-- @format -->

<script>
  import { onMount } from 'svelte';
  import { devices, deviceGet } from '../store';
  import DeviceDiscover from './DeviceDiscover.svelte';
  import DeviceAdd from './DeviceAdd.svelte';

  export let showAddDevice = false;
  export let showDiscover = false;

  onMount(() => {
    deviceGet();
  });
</script>

<div class="l-df align-col-center">
  <h1>Devices</h1>
  <div class="ml-auto">
    <button
      class="button"
      type="button"
      on:click="{() => showDiscover = !showDiscover}"
    >
      Discover
    </button>

    <button
      class="button"
      type="button"
      on:click="{() => showAddDevice = !showAddDevice}"
    >
      New
    </button>
  </div>
</div>


{#if showDiscover}
  <DeviceDiscover on:close="{() => showDiscover = false}" />
{/if}

{#if showAddDevice}
  <DeviceAdd on:close="{() => showAddDevice = false}" />
{/if}

<div class="dg grid ns-x2 mt4">
  {#each $devices as device}
    <a href="/device/{device.rowid}" class="card card-hover card-has-button">
      <div class="card-body">
        <h3 class="mv1">{device.name}</h3>

        <div class="code">{device.host}:{device.port}</div>
      </div>

      <div class="card-button">Edit</div>
    </a>
  {:else}
    <p class="w2 lead tc">😢 No registered devices.</p>
  {/each}
</div>

<style type="text/postcss">
  @import 'import.css';

  .card {
    background: $card-background-color url('/img/yeelight-color.jpg') right top no-repeat;
    background-size: contain;
  }

  .card-button {
    background: color-mod($card-background-color alpha(0.85));
  }
</style>
