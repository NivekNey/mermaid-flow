import mermaid from 'mermaid';

export async function parseMermaid(code: string) {
  if (!code || !code.trim()) {
    return { nodes: [], edges: [] };
  }

  try {
    // Initialize mermaid with some defaults
    mermaid.initialize({ 
      startOnLoad: false,
      securityLevel: 'loose',
    });
    
    // Validate first - parse() returns a promise in newer versions or throws
    try {
        await mermaid.parse(code);
    } catch (parseErr) {
        // If it's just a partial or invalid mermaid, we might not want to clear everything
        // But for now, we'll log it and return null to indicate failure
        console.warn('Mermaid validation failed', parseErr);
        return null;
    }

    const diagram = await mermaid.mermaidAPI.getDiagramFromText(code);
    const db = diagram.db;
    
    let vertices = typeof db.getVertices === 'function' ? db.getVertices() : db.vertices;
    let edges = typeof db.getEdges === 'function' ? db.getEdges() : db.edges;
    
    // If they are Maps, convert them to objects or arrays
    if (vertices instanceof Map) {
      vertices = Object.fromEntries(vertices);
    }
    if (edges instanceof Map) {
      edges = Array.from(edges.values());
    }

    if (vertices && edges) {
      const nodes = Object.keys(vertices).map(id => {
        const v = vertices[id];
        return {
          id: id,
          label: v.text || id,
          shape: v.type || 'rect'
        };
      });
      
      const formattedEdges = edges.map((e: any, index: number) => {
        return {
          id: `e${index}-${e.start}-${e.end}`,
          source: e.start,
          target: e.end,
          label: e.text || '',
          type: e.type || 'arrow'
        };
      });
      
      return { nodes, edges: formattedEdges };
    }
    
    // Fallback or other diagram types (not fully implemented yet)
    console.warn('Diagram type not fully supported for node extraction:', diagram.type);
    return { nodes: [], edges: [] };
  } catch (e) {
    console.error('Mermaid parse/extraction error:', e);
    return null;
  }
}
