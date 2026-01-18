# Phase 1: URL & State Sync (The Foundation)

1.  **Setup Service:** Create `url-store.ts` using Svelte 5 `$state`.
2.  **Compression:** Implement `compress(state) -> hash` and `decompress(hash) -> state` using `lz-string`.
3.  **Sync Logic:** Use Svelte `$effect` to watch state and update `window.location.hash`.
    *   **Critical:** Debounce URL updates by 250ms to prevent browser lag.
