<script lang="ts">
  import { currentState } from '../../state/url-store.svelte';
</script>

<div class="h-full w-full bg-gray-50 text-gray-900 p-4 relative overflow-hidden flex items-center justify-center">
  <div class="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
  
  <div class="relative z-10 text-center">
    <h2 class="text-xl mb-2 font-bold">Flow Canvas</h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Visualization will appear here</p>
    
    <div class="bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-200 dark:border-gray-700 max-w-md mx-auto text-left overflow-auto max-h-60">
      <pre class="text-xs">{currentState.code}</pre>
    </div>
  </div>
</div>

<style>
  /* Simple grid pattern for background */
  .bg-grid-slate-200 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v-1h9v-9h1v9z'/%3E%3Cpath opacity='.5' d='M41 40h4v1h-4v4h-1v-4h-9v-1h9v-9h1v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
</style>
