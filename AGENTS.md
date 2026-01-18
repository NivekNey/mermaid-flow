# Developer Guide for Agents & Humans

## Core Philosophy: Reflection
**Reflection** is the process of analyzing a completed task to identify friction points, architectural misunderstandings, or workflow inefficiencies. Every significant bug or feature should result in an update to this document to ensure the system "learns" from its mistakes.
- **Mandate:** For every bug report, first create or update a test that reproduces the failure. Ensure the test fails, then implement the fix, and verify with the test.
- **Mandate:** After a fix, reflect on *why* the bug was missed or why the first attempt failed, and document the generalized insight here.

## Project Architecture
- **Framework:** Svelte 5 (Runes) + Vite (SPA mode, NOT SvelteKit).
- **Styling:** Tailwind CSS v4.
- **State:** URL Hash is the Single Source of Truth.
  - **Schema:** Binary format (MessagePack -> Deflate -> Base64URL).
  - **Location:** `src/lib/state/url-store.svelte.ts`.

## Critical Configuration Patterns

### 1. Using SvelteKit Libraries in Plain Vite
Many Svelte libraries (e.g., `svelte-splitpanes`) assume they are running in SvelteKit and import modules like `$app/environment`.
**The Fix:**
- **Mock File:** Create a mock implementation (e.g., `src/mocks/app-environment.ts`).
- **Vite Config:** Alias the import in `resolve.alias`.
- **Esbuild Config (CRITICAL):** You MUST also add a custom esbuild plugin in `optimizeDeps.esbuildOptions.plugins` to handle the alias during dependency pre-bundling.

### 2. Tailwind CSS v4 & Node Modules
Tailwind v4's Vite plugin is aggressive about scanning files. 
**The Fix:**
- Explicitly define sources in `src/app.css` using `@source` directives to restrict scanning to your source code.

## Testing Workflow
- **Runner:** Playwright (`npx playwright test`).
- **Debugging:** If Playwright fails with "Internal Server Error" or timeouts, **manually run `npm run dev`**. Use `page.on('console', msg => console.log('BROWSER:', msg.text()))` in tests to see browser logs.
- **Tailwind v4 Colors:** Tailwind v4 uses `oklch` by default. When asserting colors in Playwright (e.g., `toHaveCSS('fill', ...)`), be prepared to handle both `rgb()` and `oklch()` formats, especially for dark mode colors. Use regex in assertions to be flexible.

## Svelte 5 & State Management Insights
- **The Snapshot Rule:** External libraries (e.g., `msgpackr`, `pako`, `elkjs`) do not understand Svelte 5 Proxies. Always use `$state.snapshot(object)` before passing state to an external function or serializing it.
- **Deep Reactivity Sync:** To ensure Svelte tracks deep object mutations (e.g., `obj.a.b = val`), iterate or serialize the object *synchronously* inside the `$effect` before any asynchronous calls like `setTimeout`.
- **Effect Location:** To ensure a state-sync effect is always active, define it at the module level inside an `$effect.root(() => { ... })`.

## XYFlow (Svelte Flow) Integration
- **Event Prop Naming:** In `@xyflow/svelte` (Svelte 5 version), use standard Svelte 5 lowercase props for events (e.g., `onnodedragstop={handler}`).
- **Event Payload:** Handlers receive a single object payload (e.g., `{ event, targetNode, nodes }`).
- **Performance:** Avoid `transition: all` on nodes as it animates `transform` changes during drag, causing visual lag. Transition only specific properties (background, color, etc.).

## Library-Specific Gotchas

### Mermaid.js (v10+)
- **Async API:** Most parsing methods (like `getDiagramFromText`) are `async`.
- **Internal DB:** In `flowchart-v2`, `diagram.db.vertices` and `diagram.db.edges` are often `Map` objects. They will appear empty in `JSON.stringify` and must be converted (e.g., `Array.from(map.values())`) before use or serialization.
- **Validation:** Always wrap `mermaid.parse(code)` in a try/catch before attempting to extract data to avoid unhandled promise rejections on invalid syntax.

### ELKjs
- **Integrity:** ELK will throw a `JsonImportException` if an edge references a node ID that is not present in the `children` array. Always validate that the node set and edge set are consistent before calling `elk.layout()`.

## Safety & Efficiency
- **File Overwrites:** Avoid using `replace` for complex multi-line blocks. Prefer `write_file` for critical module structures to prevent accidental code deletion during automated edits.

## Bug Fixes & Reflections

### Code Editor Reactivity Issue (Fixed)
**Problem:** Code editor changes weren't triggering diagram re-renders reliably.
**Root Cause:** SvelteFlow wasn't detecting node label changes because node IDs remained the same, causing component reuse without proper reactivity.
**Solution:** 
- Added explicit property access (`const code = currentState.code; const version = currentState.layoutVersion; const positions = currentState.positions;`) to force Svelte 5 reactivity tracking
- Used `$state.snapshot()` when passing positions to external libraries per the Snapshot Rule
- **Key Fix:** Added `updateKey` to node data containing `${nodeId}-${label}` to force MermaidNode component re-rendering when labels change
- Fixed TypeScript errors with proper type annotations

### Reset Layout Jankiness (Fixed)
**Problem:** Reset layout felt sluggish and inconsistent.
**Root Cause:** Fixed 300ms debounce regardless of context, and layout service wasn't optimally handling cleared positions.
**Solution:**
- Implemented adaptive debounce: 100ms when positions are empty (reset scenario), 300ms otherwise
- Improved layout service to always use ELK calculated positions when no existing positions exist
- Ensured proper state synchronization by tracking `layoutVersion` changes

### SvelteFlow + Svelte 5 Reactivity Pattern
**Critical Insight:** When using SvelteFlow with Svelte 5, node components may not re-render if only the data changes but the node ID stays the same. 
**Solution Pattern:** Include a unique `updateKey` in the node data that combines the original ID with values that should trigger re-renders (like labels).

### Testing Insights
- Created comprehensive test suite covering both issues
- Tests validate rapid code changes, layout reset responsiveness, and state persistence
- All existing tests continue to pass, ensuring no regression