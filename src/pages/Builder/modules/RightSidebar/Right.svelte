<script lang="ts">
  import { SelectedItemStore } from "../../stores/SelectedItemStore";
  import EmptySidebar from "./components/EmptySidebar.svelte";
  import TabButton from "./components/TabButton.svelte";
  import Config from "./tabs/Config.svelte";
  import Styles from "./tabs/Style.svelte";

  let activeTab = 0;

  const tabButtons = ["Style", "Configuration"];
</script>

<aside class="right-sidebar">
  <div class="right-sidebar__inner">
    {#if Object.keys($SelectedItemStore).length}
      <div class="tabs-buttons-container flex gap-2 jc-c">
        {#each tabButtons as tabButton, i (tabButton)}
          <TabButton
            copy={tabButton}
            isActive={activeTab === i}
            on:click={() => (activeTab = i)}
          />
        {/each}
      </div>
      <div class="inputs-container">
        {#if activeTab === 0}
          <Styles />
        {:else if activeTab === 1}
          <Config />
        {/if}
      </div>
    {:else}
      <EmptySidebar />
    {/if}
  </div>
</aside>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .right-sidebar {
    flex-basis: 20%;
    min-width: 20%;
    background: white;
    z-index: 2;
    overflow-y: auto;
    border-left: 1px solid $grey-a;

    .right-sidebar__inner {
      padding-top: 20px;
      position: relative;

      .inputs-container {
        max-width: 100%;
        font-size: 9px;
      }

      .tabs-buttons-container {
        padding: 0 2rem;
      }
    }
  }
</style>
