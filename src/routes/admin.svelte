<svelte:head>
  <title>Admin | Homie Bot</title>
</svelte:head>

<div class="form-group">
  <label for="sql">DB query (single SQL statement only)</label>
  <textarea
    bind:value="sql"
    id="sql"
    class="textarea w100 mono"
    rows="6"
  />
</div>

{#if msg}
  <div class="alert alert-error">
    <strong>ERROR:</strong>{' '}{msg}
  </div>
{/if}

<div class="form-group">
  <strong>Presets:</strong>
  <button
    class="button button-mini"
    type="button"
    on:click="set({ sql: 'SELECT rowid, * FROM devices;' })"
  >
    all devices
  </button>
  <button
    class="button button-mini"
    type="button"
    on:click="set({ sql: 'UPDATE devices SET name = \"New Name\" WHERE rowid = 1;' })"
  >
    update name
  </button>
</div>

<div class="form-group">
  <button class="button" type="button" on:click="handleQuery()">
    Run DB Query
  </button>

  <button class="button button-clear red3" type="button" on:click="handleReset()">
    Reset DB
  </button>
</div>

<script>
  export default {
    data: () => ({
      sql: 'SELECT rowid, * FROM devices;',
      msg: '',
    }),
    methods: {
      handleQuery() {
        const { sql } = this.get();

        try {
          this.store.dbQuery(sql);
        } catch (err) {
          // FIXME: It never gets to here
          this.set({ msg: err.message });
        }
      },

      handleReset() {
        /* eslint-disable-next-line */
        if (confirm('Reset will drop all tables and load fresh initial data. This cannot be undone. Continue?')) {
          this.store.dbReset();
        }
      },
    },
  };
</script>
