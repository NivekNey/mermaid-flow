# Milestone 4: Polish & UX (The Feel)

**Goal:** Refine the visual experience, add essential diagramming tools, and ensure the app feels "native" and professional.

## 1. Visual Styling (Tailwind)
*   **Theme:** Polish the "Dracula/Dark" theme.
*   **Typography:** Ensure Monospace fonts for code and labels.
*   **Flow Node Styling:**
    *   Create custom Node types in Svelte Flow (e.g., `<MermaidNode />`).
    *   Style based on shape (Diamond, Rect, Circle) derived from Mermaid syntax.
*   **Edge Styling:**
    *   Smooth Bezier curves.
    *   Animated "selection" states.

## 2. Floating Toolbar
*   **UI:** A rounded, floating glass-morphism panel at the bottom center.
*   **Controls:**
    *   **Zoom:** +/- buttons and Fit View.
    *   **Layout:** "Re-run Auto Layout" button (forces ELK to recalculate everything).
    *   **Theme:** Dark/Light toggle.
    *   **Share:** Trigger for the Export modal (Milestone 5).

## 3. Editor Enhancements
*   **Syntax Highlighting:** If not done in M3, integrate `prismjs` or `codemirror` for Mermaid syntax coloring.
*   **Error Handling:** If parsing fails, show a non-intrusive error toaster or underline the line in the editor.
