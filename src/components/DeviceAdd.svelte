<!-- @format -->

<script>
  import { createEventDispatcher } from 'svelte';
  // import { Select } from 'minna-ui';
  import Select from '@minna-ui/select/src/Select.svelte';

  export let ip = '192.168.1.100';
  export let name = 'My Light';
  export let type = '1';

  const dispatch = createEventDispatcher();

  function handleSubmit(event) {
    event.preventDefault();

    const data = this.get();
    this.store.devicePut(null, data);
    dispatch('close');
  }
</script>

<form class="card pa3 mv3" on:submit="{handleSubmit}">
  <h3 class="mt0 mb2">Add new device</h3>

  <div class="form-group">
    <label class="label" for="name">Name</label>
    <input bind:value="{name}" id="name" class="input" type="text">
  </div>

  <div class="form-group">
    <label class="label" for="type">Type</label>
    <!-- TODO: Make the device types come from the backend -->
    <Select
      bind:value="{type}"
      id="type"
      items="{[{ id: '1', text: 'YeeLight Colour' }]}"
      filterable="{false}"
    />
  </div>

  <div class="form-group">
    <label class="label" for="ip">IP Address</label>
    <input bind:value="{ip}" id="ip" class="input" type="text">
  </div>

  <button class="button" type="submit">Add Device</button>
  <button class="button button-clear" type="button" on:click="{() => dispatch('close')}">Cancel</button>
</form>
