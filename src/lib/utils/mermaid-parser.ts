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
    
    const direction = typeof db.getDirection === 'function' ? db.getDirection() : 'TD';
    
    let vertices = typeof db.getVertices === 'function' ? db.getVertices() : db.vertices;
    let edges = typeof db.getEdges === 'function' ? db.getEdges() : db.edges;
    let classes = typeof db.getClasses === 'function' ? db.getClasses() : db.classes;
    
    // Convert Maps to plain objects/arrays if necessary
    if (vertices instanceof Map) {
      vertices = Object.fromEntries(vertices);
    }
    if (edges instanceof Map) {
      edges = Array.from(edges.values());
    }
    if (classes instanceof Map) {
      classes = Object.fromEntries(classes);
    }

    if (vertices && edges) {
      console.log('Sample vertex:', vertices[Object.keys(vertices)[0]]);
      const nodes = Object.keys(vertices).map(id => {
        const v = vertices[id];
        return {
          id: id,
          label: v.text || id,
          shape: v.type || 'rect',
          classes: v.classes || [],
          style: v.styles || [],
          domId: v.domId
        };
      });
      
      const formattedEdges = edges.map((e: any, index: number) => {
        return {
          id: e.id || `e${index}-${e.start}-${e.end}`,
          source: e.start,
          target: e.end,
          label: e.text || '',
          stroke: e.stroke || 'normal', // normal, dotted, thick
          type: e.type || 'arrow',     // arrow, open, etc.
          length: e.length || 1,
          markerStart: e.markerStart,
          markerEnd: e.markerEnd,
        };
      });
      
      return { 
        nodes, 
        edges: formattedEdges, 
        direction,
        classes: classes || {}
      };
    }
    
    return { nodes: [], edges: [], direction: 'TD', classes: {} };
  } catch (e) {
    console.error('Mermaid parse/extraction error:', e);
    return null;
  }
}