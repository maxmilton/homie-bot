<svelte:head>
  <title>Homie Bot</title>
</svelte:head>

<DeviceList />

<script>
  import DeviceList from '../components/DeviceList.html';

  export default {
    components: {
      DeviceList,
    },
  };
</script>
