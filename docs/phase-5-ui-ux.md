# Phase 5: Visual Polish & UX

1.  **Framework:** Install **Tailwind CSS** (v3 or v4) for utility-first styling.
2.  **Component Primitives:** Use **Bits UI** or **Shadcn-Svelte** for accessible UI elements (Tooltips, Dialogs, Sliders).
3.  **Layout Structure:**
    *   **Resizable Split Pane:** Use `svelte-splitpanes` to separate the Code Editor (Left) and Flow Canvas (Right).
    *   **Floating Toolbar:** A minimalist, floating control bar (Zoom, Layout, Export, Theme) positioned at bottom-center.
4.  **Editor Styling:**
    *   **Syntax Highlighting:** Implement basic Mermaid syntax highlighting for the textarea (or use a lightweight editor like `codemirror` if the bundle size permits).
    *   **Font:** Use a high-legibility monospace font (e.g., 'JetBrains Mono' or 'Fira Code').
5.  **Flow Styling:**
    *   **Nodes:** Clean, rounded rectangles with subtle drop shadows.
    *   **Edges:** Smooth bezier curves.
    *   **Theme:** "Dracula" or "GitHub Dark" inspired color palette by default.
