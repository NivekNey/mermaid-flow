// import { browser } from '$app/environment'; // This might not be available in pure Vite CSR, checking environment is needed or just check window
import * as pako from 'pako';
import { Packr } from 'msgpackr';

// In a pure Vite SPA (not SvelteKit), '$app/environment' isn't available by default.
// We'll use a simple check for window.
const isBrowser = typeof window !== 'undefined';

// --- Types ---

// [Version, Code, Positions, Settings]
// Settings: [ThemeID, DirectionID]
export type SerializedState = [
	number,
	string,
	Record<string, [number, number]>,
	[number, number]
];

export interface AppState {
	code: string;
	positions: Record<string, [number, number]>;
	themeId: number;
	directionId: number;
}

// --- Constants ---

const MAX_URL_SIZE = 4096; // 4KB safety limit
const DEBOUNCE_MS = 250;
const packer = new Packr({ structuredClone: true });

// --- State ---

const currentState = $state<AppState>({
	code: 'graph TD\n  A[Start] --> B[End]',
	positions: {},
	themeId: 0,
	directionId: 0
});

const syncState = $state({ isTooLarge: false });

// --- Serialization Logic ---

function toBase64URL(u8: Uint8Array): string {
	return btoa(String.fromCharCode(...u8))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
}

function fromBase64URL(str: string): Uint8Array {
	const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
	const pad = base64.length % 4;
	const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
	const binary = atob(padded);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function serialize(state: AppState): string {
	const tuple: SerializedState = [
		1, // Version
		state.code,
		state.positions,
		[state.themeId, state.directionId]
	];
	
	const packed = packer.pack(tuple);
	const compressed = pako.deflate(packed);
	return toBase64URL(compressed);
}

function deserialize(hash: string): Partial<AppState> | null {
	try {
		if (!hash) return null;
		
		const compressed = fromBase64URL(hash.replace(/^#/, ''));
		const packed = pako.inflate(compressed);
		const tuple = packer.unpack(packed) as SerializedState;
		
		const [version, code, positions, settings] = tuple;
		
		if (version !== 1) {
			console.warn('Unknown state version:', version);
			return null;
		}

		return {
			code,
			positions,
			themeId: settings[0],
			directionId: settings[1]
		};
	} catch (err) {
		console.error('Failed to restore state from URL:', err);
		return null;
	}
}

// --- Sync Logic ---

function init() {
	if (!isBrowser) return;

	// 1. Read initial state from URL
	const hash = window.location.hash;
	if (hash) {
		const restored = deserialize(hash);
		if (restored) {
			currentState.code = restored.code ?? currentState.code;
			currentState.positions = restored.positions ?? currentState.positions;
			currentState.themeId = restored.themeId ?? currentState.themeId;
			currentState.directionId = restored.directionId ?? currentState.directionId;
		}
	}

	// 2. Setup debounced URL update
    let timer: any;

	$effect(() => {
        // Track dependencies
        const code = currentState.code;
        const positions = currentState.positions;
        const themeId = currentState.themeId;
        const directionId = currentState.directionId;

		clearTimeout(timer);
		timer = setTimeout(() => {
			const hash = serialize({ code, positions, themeId, directionId });
			
			if (hash.length > MAX_URL_SIZE) {
				syncState.isTooLarge = true;
			} else {
				syncState.isTooLarge = false;
				window.location.hash = hash;
			}
		}, DEBOUNCE_MS);
        
        return () => clearTimeout(timer);
	});
}

// Initialize immediately (could also be called from a component onMount)
// init();

export { currentState, syncState, init };