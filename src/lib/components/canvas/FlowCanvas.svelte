<script lang="ts">
  import { SvelteFlow, Background, Controls, MarkerType } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import { untrack } from 'svelte';
  import '@xyflow/svelte/dist/style.css';
  import { currentState } from '../../state/url-store.svelte';
  import { theme } from '../../state/theme.svelte';
  import { parseMermaid } from '../../utils/mermaid-parser';
  import { calculateLayout } from '../../layout/elk-service';

  let nodes: Node[] = $state([]);
  let edges: Edge[] = $state([]);
  let debounceTimer: ReturnType<typeof setTimeout>;

  function getNodeStyle(isDark: boolean) {
      const base = 'padding: 10px; border-radius: 5px; width: 150px; text-align: center; transition: background-color 0.2s, color 0.2s, border-color 0.2s;';
      return isDark 
        ? `background: #1f2937; border: 1px solid #4b5563; color: #f3f4f6; ${base}` 
        : `background: white; border: 1px solid #777; color: black; ${base}`;
  }

  function getEdgeParams(isDark: boolean) {
      const color = isDark ? '#9ca3af' : '#777';
      return {
          style: `stroke: ${color}`,
          markerEnd: { type: MarkerType.ArrowClosed, color }
      };
  }

  // Layout Effect: Triggered when code changes
  $effect(() => {
    const code = currentState.code;
    
    // Clear previous timer
    if (debounceTimer) clearTimeout(debounceTimer);

    // Debounce the parsing and layout
    debounceTimer = setTimeout(async () => {
        const result = await parseMermaid(code);
        if (!result) return; // Ignore invalid code

        const { nodes: rawNodes, edges: rawEdges } = result;
        const isDark = untrack(() => theme.isDark);
        
        // We untrack positions here because we only want to re-run layout when the structure (code) changes
        const currentPositions = untrack(() => currentState.positions);

        const layoutPositions = await calculateLayout(
            rawNodes.map(n => ({ id: n.id, position: { x: 0, y: 0 }, data: { label: n.label }, width: 150, height: 50 })),
            rawEdges.map(e => ({ id: e.id, source: e.source, target: e.target })),
            currentPositions
        );

        const style = getNodeStyle(isDark);
        const edgeParams = getEdgeParams(isDark);

        nodes = rawNodes.map(n => ({
            id: n.id,
            position: layoutPositions[n.id] || { x: 0, y: 0 },
            data: { label: n.label },
            style,
            type: 'default',
            connectable: false
        }));
        
        edges = rawEdges.map(e => ({
            id: e.id,
            source: e.source,
            target: e.target,
            type: 'default',
            ...edgeParams
        }));
    }, 300); // 300ms debounce

    return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
    };
  });

  // Theme update effect
  $effect(() => {
      const isDark = theme.isDark;
      untrack(() => {
          const style = getNodeStyle(isDark);
          const edgeParams = getEdgeParams(isDark);
          nodes = nodes.map(n => ({ ...n, style }));
          edges = edges.map(e => ({ ...e, ...edgeParams }));
      });
  });

  function onNodeDragStop(payload: any) {
      const targetNode = payload.targetNode;
      if (targetNode) {
          // Update the global state
          currentState.positions[targetNode.id] = [targetNode.position.x, targetNode.position.y];
      }
  }
</script>

<div class="h-full w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <SvelteFlow 
        bind:nodes 
        bind:edges 
        onnodedragstop={onNodeDragStop}
        colorMode={theme.isDark ? 'dark' : 'light'}
        fitView
        class="bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
    >
        <Background />
        <Controls />
    </SvelteFlow>
</div>