# Phase 4: The Code Parser

1.  **Watcher:** Debounced watcher on text editor.
2.  **Parser:** Parse string to extract `id`s and `connections` on change.
3.  **Diffing:** Update Flow engine nodes/edges.
    *   **Constraint:** Do NOT overwrite existing manual positions in URL.
