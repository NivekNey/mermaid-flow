# Phase 6: Export & Sharing

1.  **Image Generation:**
    *   **Library:** Use `html-to-image` (or `dom-to-image-more`) to rasterize the Svelte Flow DOM node.
    *   **DPI Control:** Allow user to select scale factor (1x, 2x, 4x) for high-res export (Retina displays/Print).

2.  **Smart Clipboard Copy:**
    *   **Goal:** Pasting into Google Docs/Notion should paste an Image that is *also* a Link back to the edit URL.
    *   **Implementation:** Use `navigator.clipboard.write()` with a `ClipboardItem`.
        *   **MIME Type `text/html`:** `<a href="{CURRENT_URL}"><img src="{DATA_URI}" /></a>`
        *   **MIME Type `image/png`:** The raw binary blob (fallback for non-HTML editors).

3.  **Standard Export:**
    *   **Download PNG/SVG:** Simple buttons to trigger file downloads.
    *   **Copy URL:** A "Share" button that copies the minified/shortened URL to the clipboard.
