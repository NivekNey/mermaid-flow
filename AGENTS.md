# Developer Guide for Agents & Humans

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
- **Esbuild Config (CRITICAL):** You MUST also add a custom esbuild plugin in `optimizeDeps.esbuildOptions.plugins` to handle the alias during dependency pre-bundling. Without this, esbuild will fail to resolve the mock, causing the optimization to fail and forcing Vite to serve raw files (which breaks other tools like Tailwind).

```typescript
// vite.config.ts
optimizeDeps: {
  esbuildOptions: {
    plugins: [
      {
        name: 'load-app-environment',
        setup(build) {
          build.onResolve({ filter: /^\$app\/environment$/ }, args => ({
            path: path.resolve(process.cwd(), 'src/mocks/app-environment.ts'),
          }))
        },
      },
    ],
  },
}
```

### 2. Tailwind CSS v4 & Node Modules
Tailwind v4's Vite plugin is aggressive about scanning files. If a dependency is not pre-bundled (see point #1) and contains syntax that looks like CSS or is ambiguous, Tailwind might crash with "Invalid declaration".
**The Fix:**
- Explicitly define sources in `src/app.css` using `@source` directives to restrict scanning to your source code.

```css
@import "tailwindcss";
@source "../src";
@source "../index.html";
```

## Testing Workflow
- **Mandate:** For every bug report, first create or update a test that reproduces the failure. Ensure the test fails, then implement the fix, and verify with the test.
- **Runner:** Playwright (`npx playwright test`).
- **Debugging:** If Playwright fails with "Internal Server Error" or timeouts, **manually run `npm run dev`**. The CLI output from the dev server often contains the actual build/runtime error that Playwright swallows or obscures.

## Svelte 5 & XYFlow Insights
- **Deep Reactivity:** When using `$effect` to sync deep objects (like `positions`), ensure the object is accessed in a way that Svelte tracks it. Moving serialization/iteration logic *inside* the effect (before any `setTimeout`) is the most reliable way to ensure deep tracking.
- **Event Handlers:** In `@xyflow/svelte` (v1+ for Svelte 5), use standard Svelte 5 event props (e.g., `onNodeDragStop={handler}`) rather than lowercase `on...`. The payload is often an object `{ event, node, nodes }` directly, not a `CustomEvent` with `detail`.
- **Performance:** Avoid `transition: all` on nodes as it animates `transform` changes during drag, causing significant visual lag. Explicitly transition only the properties that need it (background, color, etc.).
