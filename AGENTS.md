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

## Svelte 5 & State Management Insights
- **The Snapshot Rule:** External libraries (e.g., `msgpackr`, `pako`, `elkjs`) do not understand Svelte 5 Proxies. Always use `$state.snapshot(object)` before passing state to an external function or serializing it.
- **Deep Reactivity Sync:** To ensure Svelte tracks deep object mutations (e.g., `obj.a.b = val`), iterate or serialize the object *synchronously* inside the `$effect` before any asynchronous calls like `setTimeout`.
- **Effect Location:** To ensure a state-sync effect is always active, define it at the module level inside an `$effect.root(() => { ... })`.

## XYFlow (Svelte Flow) Integration
- **Event Prop Naming:** In `@xyflow/svelte` (Svelte 5 version), use standard Svelte 5 lowercase props for events (e.g., `onnodedragstop={handler}`).
- **Event Payload:** Handlers receive a single object payload (e.g., `{ event, targetNode, nodes }`).
- **Performance:** Avoid `transition: all` on nodes as it animates `transform` changes during drag, causing visual lag. Transition only specific properties (background, color, etc.).

## Safety & Efficiency
- **File Overwrites:** Avoid using `replace` for complex multi-line blocks. Prefer `write_file` for critical module structures to prevent accidental code deletion during automated edits.