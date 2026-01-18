import ELK from 'elkjs/lib/elk.bundled.js';
import type { Node, Edge } from '@xyflow/svelte';

const elk = new ELK();

export interface LayoutOptions {
  direction?: 'TB' | 'TD' | 'BT' | 'RL' | 'LR';
}

const directionMap: Record<string, string> = {
  'TB': 'DOWN',
  'TD': 'DOWN',
  'BT': 'UP',
  'LR': 'RIGHT',
  'RL': 'LEFT'
};

export async function calculateLayout(
  nodes: Node[],
  edges: Edge[],
  existingPositions: Record<string, [number, number]>,
  options: LayoutOptions = {}
): Promise<Record<string, { x: number; y: number }>> {
  const elkDirection = directionMap[options.direction || 'TD'] || 'DOWN';
  
  // Construct the graph for ELK
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': elkDirection,
      'elk.spacing.nodeNode': '50',
      'elk.layered.spacing.nodeNodeBetweenLayers': '50',
    },
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width ?? 150, // Default width if not rendered yet
      height: node.height ?? 50, // Default height
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    const positions: Record<string, { x: number; y: number }> = {};

    layoutedGraph.children?.forEach((node) => {
      if (node.id) {
        // Strategy:
        // 1. Check if node exists in AppState.positions (existingPositions)
        // 2. If yes, use that position.
        // 3. If no, use the calculated position from ELK.
        
        if (existingPositions[node.id]) {
            const [x, y] = existingPositions[node.id];
            positions[node.id] = { x, y };
        } else {
            // Always use ELK calculated position when no existing position
            positions[node.id] = { x: node.x ?? 0, y: node.y ?? 0 };
        }
      }
    });

    return positions;
  } catch (err) {
    console.error('ELK Layout Failed:', err);
    // Fallback: Just return 0,0 for everyone or existing positions
    const positions: Record<string, { x: number; y: number }> = {};
    nodes.forEach(n => {
        if (existingPositions[n.id]) {
            const [x, y] = existingPositions[n.id];
            positions[n.id] = { x, y };
        } else {
            positions[n.id] = { x: 0, y: 0 };
        }
    });
    return positions;
  }
}