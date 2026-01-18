# Milestone 1: The Foundation (State & Shell)

**Goal:** Establish the Svelte 5 application shell, set up the binary URL state management, and create the basic responsive layout.

## 1. Project Scaffolding
*   **Initialize:** Svelte 5 + Vite (TypeScript).
*   **Styling Engine:** Install **Tailwind CSS** (v4 or v3).
*   **UI Primitives:** Install `svelte-splitpanes` (for the resizable layout).

## 2. Binary State Management
*   **Dependencies:** Install `msgpackr` (serialization) and `pako` (compression).
*   **Store Implementation:** Create `src/lib/state/url-store.ts` using Svelte 5 `$state`.
*   **Schema (V1):**
    ```typescript
    type SerializedState = [
      number,                       // Version (1)
      string,                       // Code
      Record<string, [number, number]>, // Positions: { "id": [x, y] }
      [number, number]              // Settings: [ThemeID, DirectionID]
    ];
    ```
*   **Pipeline:**
    *   **Write:** State -> Tuple -> MessagePack -> Deflate -> Base64URL -> URL Hash.
    *   **Read:** URL Hash -> Base64URL Decode -> Inflate -> Unpack -> State.
*   **Sync Logic:** Use `$effect` with a 250ms debounce to update the URL when state changes.
*   **Safety:** If compressed size > 4KB, stop syncing and set a flag `isStateTooLarge = true`.

## 3. The App Shell
*   **Layout:** Create a main layout with `svelte-splitpanes`:
    *   **Left Pane:** Placeholder for Code Editor.
    *   **Right Pane:** Placeholder for Flow Canvas.
*   **Theme Store:** Simple `$state` to toggle `.dark` class on the `<html>` element (default to dark).
