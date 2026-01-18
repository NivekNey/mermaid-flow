# Phase 2: The Layout Engine (ELKjs)

1.  **Integration:** Async function `calculateLayout(nodes, edges)` using ELKjs.
2.  **Logic:**
    *   If node exists in `AppState.positions`, use that value.
    *   If node is *new*, let ELKjs calculate position.
