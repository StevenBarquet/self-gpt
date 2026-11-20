import type { ContextMode } from "src/pages/Home/HomeCont/CreateGpt/validations";
import { create, type StateCreator } from "zustand";
import { devtools, type PersistOptions, persist } from "zustand/middleware";

interface State {
	lastConversation?: string | null;
	contextMode: ContextMode; // Preferred editor for the GPT context (CreateGpt)
}

const initialState: State = {
	contextMode: "json",
};

export interface PreferencesStore extends State {
	update: (data: Partial<State>) => void;
	set: (data: State) => void;
	reset: () => void;
}

// Si quieres ocupar logica compleja, puedes manejar las actions en otro archivo
const actions: StateCreator<PreferencesStore> = (set) => ({
	...initialState,
	update: (data) => set((state) => ({ ...state, ...data })),
	set: (data) => set(() => data),
	reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----
type PersistFn = (
	config: StateCreator<PreferencesStore>,
	options: PersistOptions<PreferencesStore>,
) => StateCreator<PreferencesStore>;

const withPersist = (persist as PersistFn)(actions, {
	name: "PreferencesStorageKey",
});

export const usePreferencesStore = create<PreferencesStore>()(
	devtools(withPersist, { name: "Preferences" }),
);
