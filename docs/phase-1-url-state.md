# Phase 1: URL & State Sync (The Foundation)

1.  **Setup Service:** Create `url-store.ts` using Svelte 5 `$state`.
2.  **Binary Serialization & Compression:**
    *   **Libraries:** Install `msgpackr` (for binary JSON serialization) and `pako` (for zlib/deflate).
    *   **Schema (V1):** Define a strictly versioned tuple structure for serialization:
        ```typescript
        // [Version, Code, PositionsMap, SettingsTuple]
        type SerializedState = [
          number,                       // Version (e.g., 1)
          string,                       // Code
          Record<string, [number, number]>, // Positions: { "id": [x, y] } (Ints only)
          [number, number]              // Settings: [ThemeID, DirectionID]
        ];
        ```
    *   **Pipeline:** `State` -> `SerializedState` -> `msgpackr.pack` -> `pako.deflate` -> `Base64URL` -> `Window Hash`.
    *   **Reverse:** `Window Hash` -> `Base64URL Decode` -> `pako.inflate` -> `msgpackr.unpack` -> `State`.
3.  **Sync Logic:**
    *   Use Svelte `$effect` to watch state and update `window.location.hash`.
    *   **Critical:** Debounce URL updates by 250ms to prevent browser lag.
    *   **Graceful Degradation:** Check payload size. If > 4KB (safe limit), stop syncing to URL and show a UI warning ("State too large for URL").