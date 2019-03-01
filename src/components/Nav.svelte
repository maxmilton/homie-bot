<!-- @format -->

<script>
  export let segment;
</script>

<header class="mb4">
  <nav class="con dfc nav">
    <a href="/" id="logo">🏠🤖</a>

    <!-- Menu items -->
    <a
      href="/"
      class="nav-item {segment === undefined ? 'nav-item-active' : ''}"
    >
      Home
    </a>
    <a
      href="admin"
      class="nav-item {segment === 'admin' ? 'nav-item-active' : ''}"
    >
      Admin
    </a>
  </nav>
</header>

<style type="text/postcss">
  @import 'import.css';

  /* FIXME: This shouldn't be required; issue with minna-ui? */
  /* override Navbar component styles */
  :global(body) {
    margin-top: 0 !important; /* stylelint-disable-line declaration-no-important */
  }

  header {
    border-bottom: 1px solid color-mod($black alpha(0.1));
  }

  .nav {
    justify-content: flex-end;
  }

  #logo {
    /* stylelint-disable-line selector-max-id */
    margin-right: auto;
    font-size: 1.5em;
  }

  .nav-item {
    padding: 0.5em 1em;
    margin: 0;
  }

  .nav-item-active {
    border-bottom: 2px solid $intent-primary;
  }
</style>
