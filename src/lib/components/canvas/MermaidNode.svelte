<script lang="ts">
  import { Handle, Position } from '@xyflow/svelte';
  
  let { data } = $props();
  
  const shape = $derived(data.shape || 'rect');
  const label = $derived(data.label || '');
  const updateKey = $derived(data.updateKey || '');
</script>

<div class="mermaid-node-container relative flex items-center justify-center min-w-[120px] min-h-[40px] p-2" data-update-key={updateKey}>
  <svg 
    class="absolute inset-0 w-full h-full overflow-visible pointer-events-none" 
    viewBox="0 0 100 100" 
    preserveAspectRatio="none"
  >
    {#if shape === 'rect' || shape === 'square'}
      <rect x="0" y="0" width="100" height="100" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'round'}
      <rect x="0" y="0" width="100" height="100" rx="10" ry="10" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'stadium'}
      <rect x="0" y="0" width="100" height="100" rx="45" ry="45" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'circle'}
      <circle cx="50" cy="50" r="48" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'doublecircle'}
      <circle cx="50" cy="50" r="48" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
      <circle cx="50" cy="50" r="40" vector-effect="non-scaling-stroke" class="fill-none stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'diamond' || shape === 'rhombus'}
      <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'hexagon'}
      <path d="M 25 0 L 75 0 L 100 50 L 75 100 L 25 100 L 0 50 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'subroutine'}
      <rect x="0" y="0" width="100" height="100" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
      <line x1="10" y1="0" x2="10" y2="100" vector-effect="non-scaling-stroke" class="stroke-gray-400 dark:stroke-gray-600" />
      <line x1="90" y1="0" x2="90" y2="100" vector-effect="non-scaling-stroke" class="stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'asym' || shape === 'odd'}
      <path d="M 0 0 L 90 0 L 100 50 L 90 100 L 0 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'trapezoid'}
      <path d="M 20 0 L 80 0 L 100 100 L 0 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'inv_trapezoid' || shape === 'invtrapezoid'}
      <path d="M 0 0 L 100 0 L 80 100 L 20 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'lean_right' || shape === 'parallelogram'}
      <path d="M 20 0 L 100 0 L 80 100 L 0 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'lean_left' || shape === 'parallelogram2'}
      <path d="M 0 0 L 80 0 L 100 100 L 20 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'cylinder'}
      <path d="M 0 10 C 0 0 100 0 100 10 L 100 90 C 100 100 0 100 0 90 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
      <path d="M 0 10 C 0 20 100 20 100 10" vector-effect="non-scaling-stroke" class="fill-none stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'cloud'}
      <path d="M 25 30 C 15 30 5 40 5 50 C 5 60 15 70 25 70 L 75 70 C 85 70 95 60 95 50 C 95 40 85 30 75 30 C 75 20 65 10 50 10 C 35 10 25 20 25 30 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
    {:else if shape === 'doc'}
      <path d="M 0 0 L 100 0 L 100 80 L 80 100 L 0 100 Z" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
      <path d="M 80 100 L 80 80 L 100 80" vector-effect="non-scaling-stroke" class="fill-none stroke-gray-400 dark:stroke-gray-600" />
    {:else}
      <rect x="0" y="0" width="100" height="100" vector-effect="non-scaling-stroke" class="fill-white dark:fill-gray-800 stroke-gray-400 dark:stroke-gray-600" />
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