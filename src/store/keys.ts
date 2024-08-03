import { create, type StateCreator } from 'zustand';
import { devtools, persist, type PersistOptions } from 'zustand/middleware';

interface State {
  OPEN_AI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

const initialState: State = {};

export interface KeysStore extends State {
  update: (data: Partial<State>) => void;
  updateNested: (key: keyof State, data: Partial<State>[keyof State]) => void;
  set: (data: State) => void;
  reset: () => void;
}

const actions: StateCreator<KeysStore> = (set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  updateNested: (key, data) => set((state) => ({ ...state, [key]: data })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----
type PersistFn = (
  config: StateCreator<KeysStore>,
  options: PersistOptions<KeysStore>,
) => StateCreator<KeysStore>;

const withPersist = (persist as PersistFn)(actions, { name: 'KeysStorageKey' });

export const useKeysStore = create<KeysStore>()(devtools(withPersist, { name: 'Keys' }));
