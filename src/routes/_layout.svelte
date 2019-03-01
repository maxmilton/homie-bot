<Nav segment="{child.segment}"/>

<main class="con">
  <svelte:component this="{child.component}" {...child.props}/>
</main>

<footer class="footer tc">
  © <a href="https://maxmilton.com" class="inherit">Max Milton</a>{' '}| {GIT_RELEASE}
</footer>

<script>
  import Nav from '../components/Nav.html';

  export default {
    helpers: {
      GIT_RELEASE: process.env.GIT_RELEASE,
    },
    components: {
      Nav,
    },
    oncreate() {
      if (process.env.NODE_ENV === 'development') {
        // allow access to store via devtools; e.g. run `store.get()` in console
        /* eslint-disable-next-line no-restricted-globals */
        self.store = this.store;
      }
    },
  };
</script>
