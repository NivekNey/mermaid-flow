# Milestone 3: The Editor & Parser (The Loop)

**Goal:** Implement the code editor and the logic to parse Mermaid syntax into nodes/edges, completing the bidirectional sync loop.

## 1. The Code Editor
*   **Component:** Create `<CodeEditor />` in the left pane.
*   **Implementation:** Use a simple `<textarea>` initially, or a lightweight wrapper like `svelte-codemirror-editor` if syntax highlighting is desired immediately.
*   **Binding:** Two-way bind to `AppState.code`.

## 2. The Parser
*   **Dependency:** Install `mermaid`.
*   **Logic:**
    *   Use `mermaid.parse()` (or internal API) to generate the Abstract Syntax Tree (AST).
    *   Extract:
        *   **Nodes:** IDs, Labels, Shapes.
        *   **Edges:** Source, Target, Label, Type (arrowhead).

## 3. The "Smart Diff" Loop
*   **Watcher:** Watch `AppState.code` for changes (debounced).
*   **Process:**
    1.  Parse Code -> New Graph Structure.
    2.  **Diff:** Compare new structure vs. old structure.
    3.  **Layout:**
        *   Identify *newly added* nodes.
        *   Run ELKjs **only** on the new graph structure (or a subgraph) to find initial positions.
        *   **Crucial:** Do not overwrite positions of nodes that exist in `AppState.positions`.
    4.  **Render:** Update Svelte Flow nodes/edges.

## 4. Reverse Sync (Optional/Advanced)
*   *Future Consideration:* If a user *deletes* a node in the UI (Backspace), should it remove the line from the code?
    *   *Decision:* For V1, Code is the "Source of Truth" for structure. UI deletion might be disabled or just clear the position.
