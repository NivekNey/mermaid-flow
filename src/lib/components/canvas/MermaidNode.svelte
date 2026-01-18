<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  
  let { data } = $props();
  
  const shape = data.shape || 'rect';
  const label = data.label || '';
</script>

<div class="mermaid-node-container relative flex items-center justify-center min-w-[150px] min-h-[50px] p-2">
  <svg class="absolute inset-0 w-full h-full overflow-visible pointer-events-none" preserveAspectRatio="none">
    {#if shape === 'rect'}
      <rect x="0" y="0" width="100%" height="100%" rx="0" ry="0" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'round'}
      <rect x="0" y="0" width="100%" height="100%" rx="10" ry="10" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'stadium'}
      <rect x="0" y="0" width="100%" height="100%" rx="25" ry="25" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'circle'}
      <circle cx="50%" cy="50%" r="45%" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'diamond'}
      <path d="M 50% 0 L 100% 50% L 50% 100% L 0 50% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'hexagon'}
      <path d="M 25% 0 L 75% 0 L 100% 50% L 75% 100% L 25% 100% L 0 50% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'odd'}
      <path d="M 0 0 L 100% 0 L 100% 80% L 80% 100% L 0 100% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'trapezoid'}
      <path d="M 20% 0 L 80% 0 L 100% 100% L 0 100% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'invtrapezoid'}
      <path d="M 0 0 L 100% 0 L 80% 100% L 20% 100% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'lean_right'}
      <path d="M 20% 0 L 100% 0 L 80% 100% L 0 100% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'lean_left'}
      <path d="M 0 0 L 80% 0 L 100% 100% L 20% 100% Z" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else}
      <rect x="0" y="0" width="100%" height="100%" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {/if}
  </svg>
  
  <div class="relative z-10 text-sm font-medium text-center px-4 py-2 break-words max-w-[180px]">
    {label}
  </div>

  <Handle type="target" position={Position.Top} class="!bg-blue-500" />
  <Handle type="source" position={Position.Bottom} class="!bg-blue-500" />
</div>

<style>
  :global(.svelte-flow__node-mermaid) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }
</style>
