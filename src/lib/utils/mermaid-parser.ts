import mermaid from 'mermaid';

export async function parseMermaid(code: string) {
  if (!code || !code.trim()) {
    return { nodes: [], edges: [], direction: 'TD' };
  }

  try {
    // Initialize mermaid with some defaults
    mermaid.initialize({ 
      startOnLoad: false,
      securityLevel: 'loose',
    });
    
    // Validate first
    try {
        await mermaid.parse(code);
    } catch (parseErr) {
        console.warn('Mermaid validation failed', parseErr);
        return null;
    }

    const diagram = await mermaid.mermaidAPI.getDiagramFromText(code);
    const db = diagram.db;
    
    // Try to access the data directly
    const direction = db?.direction || 'TD';
    
    let vertices = db?.vertices || {};
    let edges = db?.edges || [];
    
    // Convert Maps to plain objects/arrays if necessary
    if (vertices instanceof Map) {
      vertices = Object.fromEntries(vertices);
    }
    if (edges instanceof Map) {
      edges = Array.from(edges.values());
    }
    
    const nodes = Object.keys(vertices).map(id => {
      const v = vertices[id];
      const label = v?.text || v?.label || id;
      
      return {
        id: id,
        label: label,
        shape: v?.type || 'rect',
        classes: v?.classes || [],
        style: v?.styles || [],
        domId: v?.domId
      };
    });
    
    const formattedEdges = edges.map((e: any, index: number) => {
      return {
        id: e?.id || `e${index}`,
        source: e?.start,
        target: e?.end,
        label: e?.text || '',
        stroke: e?.stroke || 'normal',
        type: e?.type || 'arrow',
        length: e?.length || 1,
        markerStart: e?.markerStart,
        markerEnd: e?.markerEnd,
      };
    });
    
    console.log('Final parsed result:', { nodes, edges, direction });
    
    return { 
      nodes, 
      edges: formattedEdges, 
      direction,
      classes: {}
    };
  } catch (e) {
    console.error('Mermaid parse/extraction error:', e);
    return null;
  }
}