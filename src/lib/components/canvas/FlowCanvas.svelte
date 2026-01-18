<script lang="ts">
  import { SvelteFlow, Background, Controls, MarkerType } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import { untrack } from 'svelte';
  import '@xyflow/svelte/dist/style.css';
  import { currentState } from '../../state/url-store.svelte';
  import { theme } from '../../state/theme.svelte';
  import { parseMermaid } from '../../utils/mermaid-parser';
  import { calculateLayout } from '../../layout/elk-service';
  import MermaidNode from './MermaidNode.svelte';

  const nodeTypes = {
    mermaid: MermaidNode
  };

  let nodes: Node[] = $state([]);
  let edges: Edge[] = $state([]);
  let debounceTimer: ReturnType<typeof setTimeout>;

  function getEdgeParams(isDark: boolean) {
      const color = isDark ? '#9ca3af' : '#777';
      return {
          style: `stroke: ${color}`,
          markerEnd: { type: MarkerType.ArrowClosed, color }
      };
  }

  // Layout Effect: Triggered when code or layoutVersion changes
  $effect(() => {
    // Force reactivity tracking by accessing the properties
    const code = currentState.code;
    const version = currentState.layoutVersion;
    const positions = currentState.positions;
    
    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Use shorter debounce for layout reset to feel more responsive
    const debounceMs = Object.keys(positions).length === 0 ? 100 : 300;

    // Debounce the parsing and layout
    debounceTimer = setTimeout(async () => {
        const result = await parseMermaid(code);
        if (!result) return;

        const { nodes: rawNodes, edges: rawEdges, direction } = result;
        const isDark = untrack(() => theme.isDark);
        const currentPositions = untrack(() => $state.snapshot(currentState.positions));

        const layoutPositions = await calculateLayout(
            rawNodes.map(n => ({ id: n.id, position: { x: 0, y: 0 }, data: { label: n.label }, width: 150, height: 50 })),
            rawEdges.map((e: any) => ({ id: e.id, source: e.source, target: e.target })),
            currentPositions,
            { direction: direction as any }
        );

        const edgeParams = getEdgeParams(isDark);

        const newNodes = rawNodes.map(n => ({
            id: n.id, // Keep original ID for edge linking
            position: layoutPositions[n.id] || { x: 0, y: 0 },
            data: { label: n.label, shape: n.shape, updateKey: `${n.id}-${n.label}` }, // Add update key for reactivity
            type: 'mermaid',
            connectable: false
        }));
        
        nodes = newNodes;
        
        edges = rawEdges.map((e: any) => ({
            id: e.id,
            source: e.source,
            target: e.target,
            label: e.label,
            type: 'default',
            ...edgeParams
        }));
    }, debounceMs);

    return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
    };
  });

  // Theme update effect
  $effect(() => {
      const isDark = theme.isDark;
      untrack(() => {
          const edgeParams = getEdgeParams(isDark);
          edges = edges.map(e => ({ ...e, ...edgeParams }));
      });
  });

  function onNodeDragStop(payload: any) {
      const targetNode = payload.targetNode;
      if (targetNode) {
          currentState.positions[targetNode.id] = [targetNode.position.x, targetNode.position.y];
      }
  }
</script>

<div class="h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <SvelteFlow 
        bind:nodes 
        bind:edges 
        {nodeTypes}
        onnodedragstop={onNodeDragStop}
        colorMode={theme.isDark ? 'dark' : 'light'}
        fitView
        
        class="bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
    >
        <Background />
        <Controls />
    </SvelteFlow>
</div>