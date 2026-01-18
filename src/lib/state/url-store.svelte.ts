// import { browser } from '$app/environment';
import * as pako from 'pako';
import { Packr } from 'msgpackr';

const isBrowser = typeof window !== 'undefined';

// --- Types ---

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

// --- State ---

const currentState = $state<AppState>({
	code: 'graph TD\n  A[Start] --> B[End]',
	positions: {},
	themeId: 0,
	directionId: 0
});

const syncState = $state({ isTooLarge: false });

// --- Helpers ---

const packer = new Packr({ structuredClone: true });
const MAX_URL_SIZE = 4096;
const DEBOUNCE_MS = 250;

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
    const snapshot = $state.snapshot(state);
	const tuple: SerializedState = [
		1,
		snapshot.code,
		snapshot.positions,
		[snapshot.themeId, snapshot.directionId]
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
		return {
			code: tuple[1],
			positions: tuple[2],
			themeId: tuple[3][0],
			directionId: tuple[3][1]
		};
	} catch (err) {
		return null;
	}
}

// --- Sync Logic ---

let timer: any;

export function init() {
	if (!isBrowser) return;
	const hash = window.location.hash;
	if (hash) {
		const restored = deserialize(hash);
		if (restored) {
			currentState.code = restored.code ?? currentState.code;
			if (restored.positions) {
				currentState.positions = { ...restored.positions };
			}
			currentState.themeId = restored.themeId ?? currentState.themeId;
			currentState.directionId = restored.directionId ?? currentState.directionId;
		}
	}

    // Start sync effect
    $effect.root(() => {
        $effect(() => {
            const hash = serialize(currentState);
            clearTimeout(timer);
            timer = setTimeout(() => {
                if (hash.length <= MAX_URL_SIZE) {
                    window.location.hash = hash;
                }
            }, DEBOUNCE_MS);
        });
    });
}

export { currentState, syncState };
