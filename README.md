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

## Implementation Milestones

### [Milestone 1: The Foundation (State & Shell)](docs/milestone-1-foundation.md)
*   **Goal:** App shell, Tailwind setup, and Binary URL State (MessagePack/Deflate).
*   **Key Tech:** Svelte 5, Tailwind, `url-store.ts`.

### [Milestone 2: The Visual Canvas (Flow & Layout)](docs/milestone-2-visual-canvas.md)
*   **Goal:** `@xyflow/svelte` integration and `elkjs` auto-layout.
*   **Key Tech:** Svelte Flow, ELKjs.

### [Milestone 3: The Editor & Parser (The Loop)](docs/milestone-3-editor-parser.md)
*   **Goal:** Text Editor, Mermaid Parser, and the "Code -> Flow" diffing logic.
*   **Key Tech:** `mermaid`, AST Parsing, Two-way Binding.

### [Milestone 4: Polish & UX (The Feel)](docs/milestone-4-polish-ux.md)
*   **Goal:** Deep styling, custom node shapes, floating toolbars, and error handling.
*   **Key Tech:** Custom Flow Nodes, Glassmorphism UI.

### [Milestone 5: Export & Sharing (The Value)](docs/milestone-5-export-share.md)
*   **Goal:** Polymorphic Clipboard (HTML/PNG/Text), Markdown Copy, and Image Download.
*   **Key Tech:** `navigator.clipboard`, `html-to-image`.