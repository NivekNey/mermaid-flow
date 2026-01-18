# Milestone 5: Export & Sharing (The Value)

**Goal:** Enable users to share their work effortlessly through smart clipboard integration and file exports.

## 1. The Polymorphic Clipboard (Smart Copy)
*   **Action:** "Copy to Clipboard" button (and `Cmd+C` when canvas is focused).
*   **Implementation:** `navigator.clipboard.write()` with multiple MIME types:
    *   `text/plain`: Raw Mermaid Code.
    *   `text/html`: `<a href="..."><img src="..." /></a>` (For Docs/Email).
    *   `image/png`: High-Res Binary Blob (For Slack/Discord).
    *   `text/uri-list`: The App URL.

## 2. Dev-Centric Copy
*   **"Copy Markdown":** Generates `[![Alt](KrokiURL)](AppURL)`.
    *   *Dependency:* Use a public Kroki instance (or offer configuration) to generate the static image URL for the Markdown preview.

## 3. File Download
*   **Library:** `html-to-image` (ensure ForeignObject support).
*   **Formats:**
    *   **PNG:** with 2x/4x scaling options.
    *   **SVG:** Vector export.
