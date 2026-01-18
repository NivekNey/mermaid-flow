<script lang="ts">
  import { currentState } from '../../state/url-store.svelte';
</script>

<div class="h-full w-full bg-gray-900 text-white p-4 font-mono">
  <h2 class="text-xl mb-4 border-b border-gray-700 pb-2">Code Editor</h2>
  <textarea
    class="w-full h-[calc(100%-3rem)] bg-gray-800 text-gray-100 p-2 border border-gray-700 rounded resize-none focus:outline-none focus:border-blue-500"
    bind:value={currentState.code}
    spellcheck="false"
  ></textarea>
</div>
