declare module 'elkjs/lib/elk.bundled.js' {
    export interface ElkNode {
        id: string;
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        children?: ElkNode[];
        edges?: ElkEdge[];
        layoutOptions?: Record<string, string>;
        [key: string]: any;
    }

    export interface ElkEdge {
        id: string;
        sources: string[];
        targets: string[];
        [key: string]: any;
    }

    export default class ELK {
        layout(graph: ElkNode, options?: any): Promise<ElkNode>;
    }
}
