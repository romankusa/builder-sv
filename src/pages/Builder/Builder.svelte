<script lang="ts">
  import Left from "./modules/LeftSidebar/Left.svelte";
  import Right from "./modules/RightSidebar/Right.svelte";
  import UserSite from "./modules/UserSite/UserSite.svelte";
  import Highlight from "./components/organisms/Highlight.svelte";
  import Header from "./modules/Header/Header.svelte";
  import Add from "./modules/Add/Add.svelte";
  import { initZoom } from "./lib/zoom";
  import selectedItemInput from "./lib/selectedItemInput";
  import userSite from "./lib/userSite";
  import { onDestroy, onMount } from "svelte";
  import { cleanKeyboard, initKeyboard } from "./lib/keyboard";
  import { ItemsStore } from "./stores/ItemsStore";
  import { StyleStore } from "./stores/StyleStore";
  import { HighlightStore } from "./stores/HighlightStore";
  import { SelectedItemStore } from "./stores/SelectedItemStore";

  const cleanups = [];
  onMount(async () => {
    setTimeout(async () => {
      cleanups.push(initZoom());
      userSite();
      initKeyboard();

      setTimeout(async () => {
        const unItemsStore = await ItemsStore.hydrate();

        const unStyleStore = await StyleStore.hydrate();
        cleanups.push(unItemsStore, unStyleStore);
        selectedItemInput().hydrate();
      }, 400);
    }, 400);
  });

  onDestroy(() => {
    if (cleanups.length > 0) cleanups.forEach((cb) => cb());
    ItemsStore.cleanup();
    StyleStore.cleanup();
    HighlightStore.clear();
    SelectedItemStore.clear();
    selectedItemInput().clear();
    cleanKeyboard();
    if (selectedItemInput().cleanup) selectedItemInput().cleanup();
    if (userSite().cleanup) userSite().cleanup();
  });
</script>

<div class="builder">
  <Header />
  <main class="app">
    <div class="app__inner">
      <Add />
      <Left />
      <UserSite />
      <Right />
      <Highlight />
    </div>
    <input
      class="selected-item-input"
      type="text"
      style="position: fixed;top: 0;left: 0;height: 0;width: 0;z-index: -1;"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </main>
</div>

<style type="text/scss">
  :global(:root) {
    --header-height: 50px;
    --footer-height: 30px;
    --left-sidebar-width: 20%;
  }

  .builder {
    overflow: hidden;
    overscroll-behavior-x: none;
    position: relative;
  }

  .app {
    &__inner {
      display: flex;
      height: calc(100vh - var(--header-height) - var(--footer-height));
    }
  }
</style>
