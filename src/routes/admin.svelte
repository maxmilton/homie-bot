<!-- @format -->

<script>
  import { dbQuery, dbReset } from '../store';

  let sql = 'SELECT rowid, * FROM devices;';
  let msg = '';

  function handleQuery() {
    try {
      dbQuery(sql);
    } catch (err) {
      // FIXME: It never gets to here
      msg = err.message;
    }
  }

  function handleReset() {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Reset will drop all tables and load fresh initial data. This cannot be undone. Continue?')) {
      dbReset();
    }
  }
</script>

<svelte:head>
  <title>Admin | Homie Bot</title>
</svelte:head>

<div class="form-group">
  <label for="sql">DB query (single SQL statement only)</label>
  <textarea
    bind:value="{sql}"
    id="sql"
    class="textarea w100 mono"
    rows="6"
  />
</div>

{#if msg}
  <div class="alert alert-error">
    <strong>ERROR:</strong> {msg}
  </div>
{/if}

<div class="form-group">
  <strong>Presets:</strong>
  <button
    class="button button-mini"
    type="button"
    on:click="{() => sql = 'SELECT rowid, * FROM devices;'}"
  >
    all devices
  </button>
  <button
    class="button button-mini"
    type="button"
    on:click="{() => sql = 'UPDATE devices SET name = \"New Name\" WHERE rowid = 1;'}"
  >
    update name
  </button>
</div>

<div class="form-group">
  <button class="button" type="button" on:click="{handleQuery}">
    Run DB Query
  </button>

  <button class="button button-clear red3" type="button" on:click="{handleReset}">
    Reset DB
  </button>
</div>
