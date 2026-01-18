<script lang="ts">
  import { SvelteFlow, Background, Controls, useSvelteFlow, MarkerType } from '@xyflow/svelte';
  import type { Node, Edge } from '@xyflow/svelte';
  import { untrack } from 'svelte';
  import '@xyflow/svelte/dist/style.css';
  import { currentState } from '../../state/url-store.svelte';
  import { theme } from '../../state/theme.svelte';
  import { parseMermaid } from '../../utils/simple-parser';
  import { calculateLayout } from '../../layout/elk-service';

  let nodes: Node[] = $state([]);
  let edges: Edge[] = $state([]);

  function getNodeStyle(isDark: boolean) {
      return isDark 
        ? 'background: #1f2937; border: 1px solid #4b5563; color: #f3f4f6; padding: 10px; border-radius: 5px; width: 150px; text-align: center; transition: background-color 0.2s, color 0.2s, border-color 0.2s;' 
        : 'background: white; border: 1px solid #777; color: black; padding: 10px; border-radius: 5px; width: 150px; text-align: center; transition: background-color 0.2s, color 0.2s, border-color 0.2s;';
  }

  function getEdgeParams(isDark: boolean) {
      const color = isDark ? '#9ca3af' : '#777';
      return {
          style: `stroke: ${color}`,
          markerEnd: {
              type: MarkerType.ArrowClosed,
              color: color
          }
      };
  }

  // Effect 1: Sync code -> visual graph (Layout)
  $effect(() => {
    const code = currentState.code;
    const { nodes: rawNodes, edges: rawEdges } = parseMermaid(code);
    
    // Capture theme dependency synchronously but without tracking
    // This ensures layout only re-runs when code changes, not when theme changes
    const isDark = untrack(() => theme.isDark);
    const existingPositions = untrack(() => currentState.positions);

    // Calculate layout, respecting existing positions
    calculateLayout(
        rawNodes.map(n => ({ 
            id: n.id, 
            position: { x: 0, y: 0 }, 
            data: { label: n.label },
            width: 150, 
            height: 50 
        })),
        rawEdges.map(e => ({ 
            id: e.id, 
            source: e.source, 
            target: e.target 
        })),
        existingPositions
    ).then(positions => {
        const style = getNodeStyle(isDark);
        const edgeParams = getEdgeParams(isDark);

        nodes = rawNodes.map(n => ({
            id: n.id,
            position: positions[n.id] || { x: 0, y: 0 },
            data: { label: n.label },
            style: style,
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
    });
  });

  // Effect 2: Update styles when theme changes (without re-layout)
  $effect(() => {
      const isDark = theme.isDark;
      
      untrack(() => {
          if (nodes.length > 0) {
              const style = getNodeStyle(isDark);
              nodes = nodes.map(n => ({
                  ...n,
                  style
              }));
          }

          if (edges.length > 0) {
              const edgeParams = getEdgeParams(isDark);
              edges = edges.map(e => ({
                  ...e,
                  ...edgeParams
              }));
          }
      });
  });

  function onNodeDragStop(event: any) {
      // The event detail contains the node that was dragged
      // Check event structure - usually event.detail.node
      const draggedNode = event.detail.node;
      if (draggedNode) {
          currentState.positions[draggedNode.id] = [draggedNode.position.x, draggedNode.position.y];
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
        minZoom={0.1}
        class="bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
    >
        <Background />
        <Controls />
    </SvelteFlow>
</div>