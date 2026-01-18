# Mermaid Flow (Interactive Mermaid Editor)

## Core Objectives
* **Zero-Backend:** All state resides in the URL hash.
* **Hybrid Layout:** Mermaid-like syntax for structure; manual drag overrides.
* **Performance:** 60fps interaction using Svelte 5 and Svelte Flow.
* **Compression:** `lz-string` for maximum data in URL.

## Tech Stack
* **Framework:** Svelte 5 (Runes).
* **Build Tool:** Vite.
* **Flow Engine:** `@xyflow/svelte`.
* **Layout Engine:** `elkjs` (automated positioning).
* **Compression:** `lz-string`.
* **Parsing:** `mermaid` or custom lightweight parser.

## State Schema
Source of Truth: synced to URL hash.

```typescript
interface AppState {
  code: string;           // Raw Mermaid-like text
  positions: Record<string, {x: number, y: number}>; // User manual overrides
  settings: {
    theme: 'light' | 'dark';
    layoutDirection: 'TB' | 'LR';
  };
}
```
