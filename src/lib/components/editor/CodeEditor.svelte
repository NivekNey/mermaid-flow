<script lang="ts">
  import { currentState } from '../../state/url-store.svelte';
  import { theme } from '../../state/theme.svelte';
</script>

<div class="h-full w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 font-mono transition-colors duration-200">
  <h2 class="text-xl mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">Code Editor</h2>
  <textarea
    class="w-full h-[calc(100%-3rem)] bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 border border-gray-200 dark:border-gray-800 rounded resize-none focus:outline-none focus:border-blue-500 transition-colors duration-200"
    bind:value={currentState.code}
    spellcheck="false"
  ></textarea>
</div>
