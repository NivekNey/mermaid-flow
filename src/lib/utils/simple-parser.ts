export function parseMermaid(code: string) {
    const nodes = new Map<string, { id: string; label: string }>();
    const edges: { id: string; source: string; target: string }[] = [];

    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('graph') || trimmed.startsWith('flowchart')) return;

        // Simple match for A --> B or A[Label] --> B[Other]
        // Regex is tricky for nested brackets, keep it simple: 
        // Split by '-->' first
        if (trimmed.includes('-->')) {
            const parts = trimmed.split('-->');
            if (parts.length === 2) {
                const sourceRaw = parts[0].trim();
                const targetRaw = parts[1].trim();
                
                const source = parseNode(sourceRaw);
                const target = parseNode(targetRaw);
                
                nodes.set(source.id, source);
                nodes.set(target.id, target);
                
                edges.push({
                    id: `e-${source.id}-${target.id}`,
                    source: source.id,
                    target: target.id
                });
            }
        } else { 
             // Maybe just a node declaration: A[Label]
             const node = parseNode(trimmed);
             if (node.id) {
                 nodes.set(node.id, node);
             }
        }
    });

    return {
        nodes: Array.from(nodes.values()),
        edges
    };
}

function parseNode(raw: string): { id: string; label: string } {
    // Matches ID[Label] or just ID
    const match = raw.match(/^([^\[]+)(?:\[(.*)\])?$/);
    if (match) {
        return {
            id: match[1],
            label: match[2] || match[1]
        };
    }
    return { id: raw, label: raw }; // Fallback
}
