<script lang="ts">
  // import { Pane, Splitpanes } from 'svelte-splitpanes';
  import { Pane, Splitpanes } from 'svelte-splitpanes';
  // import Pane from './lib/mocks/Pane.svelte';
  // import Splitpanes from './lib/mocks/Splitpanes.svelte';
  import CodeEditor from './lib/components/editor/CodeEditor.svelte';
  import FlowCanvas from './lib/components/canvas/FlowCanvas.svelte';
  import { syncState, init as initUrlStore } from './lib/state/url-store.svelte';
  import { theme } from './lib/state/theme.svelte';

  initUrlStore();

  $effect(() => {
    theme.apply();
  });
</script>

<main class="h-screen w-screen flex flex-col overflow-hidden bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
  <!-- Header -->
  <header class="h-12 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-gray-50 dark:bg-gray-900">
    <div class="flex items-center gap-2">
      <h1 class="font-bold text-lg tracking-tight"><span class="text-blue-600 dark:text-blue-400">Mermaid</span>Flow</h1>
      {#if syncState.isTooLarge}
        <span class="text-xs text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
          State too large to sync
        </span>
      {/if}
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        onclick={theme.toggle}
        class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle Theme"
      >
        {#if theme.isDark}
          <!-- Sun Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41-1.41"/><path d="m19.07 4.93-1.41-1.41"/></svg>
        {:else}
          <!-- Moon Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        {/if}
      </button>
      
      <a 
        href="https://github.com/NivekNey/mermaid-flow" 
        target="_blank" 
        rel="noreferrer"
        class="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        aria-label="View on GitHub"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0 3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
      </a>
    </div>
  </header>

  <!-- Main Content -->
  <div class="flex-1 overflow-hidden relative">
    <Splitpanes theme="modern-theme">
      <Pane minSize={20}>
        <CodeEditor />
      </Pane>
      <Pane minSize={20}>
        <FlowCanvas />
      </Pane>
    </Splitpanes>
  </div>
</main>

<style>
  /* Fix for Splitpanes to fill height */
  :global(.splitpanes.modern-theme .splitpanes__pane) {
    background-color: transparent;
  }
  :global(.splitpanes.modern-theme .splitpanes__splitter) {
    background-color: #e5e7eb;
    min-width: 6px;
    min-height: 6px;
  }
  :global(.dark .splitpanes.modern-theme .splitpanes__splitter) {
    background-color: #374151;
  }
  :global(.splitpanes.modern-theme .splitpanes__splitter:hover) {
    background-color: #cbd5e1;
  }
  :global(.dark .splitpanes.modern-theme .splitpanes__splitter:hover) {
    background-color: #4b5563;
  }
</style>