<!-- @format -->

<script>
  import Nav from '../components/Nav.svelte';

  export let segment;

  const release = process.env.GIT_RELEASE;
</script>

<Nav {segment} />

<main class="con">
  <slot></slot>
</main>

<footer class="footer tc">
  © <a href="https://maxmilton.com" class="inherit">Max Milton</a> | {release}
</footer>
