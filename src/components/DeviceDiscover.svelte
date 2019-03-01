<!-- @format -->

<script>
  import { createEventDispatcher } from 'svelte';
  import { devicePut } from '../store';

  const dispatch = createEventDispatcher();

  const result = fetch('/api/discover').then(async (res) => {
    if (!res.ok) throw new Error(res.statusText);

    return res.json();
  });

  async function add(device) {
    devicePut(null, {
      host: device.host,
      name: 'New Device',
      port: device.port,
    });

    dispatch('close');
  }
</script>

{#await result}
  <p class="lead tc"><span class="spinner pr2 mr2" /> Searching...</p>
{:then devices}
  <div class="table-responsive">
    <table class="table mv4">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Host</th>
          <th>Port</th>
        </tr>
      </thead>
      <tbody>
        {#each devices as device}
          <tr>
            <td><button class="button" type="button" on:click="{() => add(device)}">Add</button></td>
            <td>{device.name || '??'}</td>
            <td>{device.host}</td>
            <td>{device.port}</td>
          </tr>
        {:else}
          <!-- FIXME: Return 200 response with empty array if no devices found -->
          <tr>
            <td colspan="5" class="tc">No devices found on your local network.</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{:catch err}
  <div class="alert alert-error">
    <strong>ERROR:</strong> {err}
  </div>
{/await}
