# Mermaid Flow (Interactive Mermaid Editor)

## Core Objectives
* **Zero-Backend:** All state resides in the URL hash.
* **Hybrid Layout:** Mermaid-like syntax for structure; manual drag overrides.
* **Performance:** 60fps interaction using Svelte 5 and Svelte Flow.
* **Compression:** `msgpackr` + `pako` (Deflate) for industry-standard binary compression.
* **Smart Export:** Copy images that automatically link back to the editable diagram URL.

## Tech Stack
* **Framework:** Svelte 5 (Runes).
* **Styling:** Tailwind CSS + Bits UI / Shadcn-Svelte.
* **Build Tool:** Vite.
* **Flow Engine:** `@xyflow/svelte`.
* **Layout Engine:** `elkjs` (automated positioning).
* **Compression:** `msgpackr` (serialization) + `pako` (deflate).
* **Parsing:** `mermaid` or custom lightweight parser.
* **Export:** `html-to-image` (Canvas rasterization).

## State Schema
Source of Truth: synced to URL hash.

**Runtime State:**
```typescript
interface AppState {
  code: string;
  positions: Record<string, {x: number, y: number}>;
  settings: {
    theme: 'light' | 'dark';
    layoutDirection: 'TB' | 'LR';
  };
}
```

**Serialized URL Schema (Binary V1):**
*   **Format:** `[Version, Code, PositionMap, SettingsTuple]`
*   **Positions:** Stored as integer tuples `[x, y]` to save space.
*   **Encoding:** MessagePack -> Deflate -> Base64URL.
