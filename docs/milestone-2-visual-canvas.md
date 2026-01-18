# Milestone 2: The Visual Canvas (Flow & Layout)

**Goal:** Implement the diagram rendering engine using Svelte Flow and the auto-layout logic using ELKjs.

## 1. Flow Engine Setup
*   **Dependency:** Install `@xyflow/svelte`.
*   **Component:** Create `<GraphCanvas />` in the right pane.
*   **Binding:** Map `AppState` nodes/edges to Svelte Flow's internal format.
    *   *Optimization:* Use `$state.raw` or careful derivation to avoid deep reactivity overhead on large graphs.

## 2. Auto-Layout Engine (ELK)
*   **Dependency:** Install `elkjs` (and `web-worker` setup if needed for performance).
*   **Service:** Create `src/lib/layout/elk-service.ts`.
*   **Function:** `calculateLayout(nodes, edges, options)`
    *   Returns a map of `{ id: { x, y } }`.
*   **Strategy:**
    *   For **New Nodes** (not in `AppState.positions`): Use ELK's calculated position.
    *   For **Existing Nodes** (in `AppState.positions`): Preserve the user's manual position.

## 3. Interactive Logic
*   **Drag & Drop:** Listen to `onNodeDragStop`.
*   **Update State:** Update `AppState.positions` with the new coordinates.
    *   *Verify:* Ensure this triggers the URL update mechanism from Milestone 1.
