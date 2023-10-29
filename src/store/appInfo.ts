import { create, StateCreator } from 'zustand';
import { devtools, persist, PersistOptions } from 'zustand/middleware';

interface State {
  count: number;
}

const initialState: State = {
  count: 0,
};

export interface AppInfoStore extends State {
  update: (data: Partial<State>) => void;
  updateNested: (key: keyof State, data: Partial<State>[keyof State]) => void;
  set: (data: State) => void;
  reset: () => void;
}

const actions: StateCreator<AppInfoStore> = (set) => ({
  ...initialState,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  update: (data) => set((state) => ({ ...state, ...data })),
  updateNested: (key, data) => set((state) => ({ ...state, [key]: data })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----
type PersistFn = (
  config: StateCreator<AppInfoStore>,
  options: PersistOptions<AppInfoStore>,
) => StateCreator<AppInfoStore>;

const withPersist = (persist as PersistFn)(actions, { name: 'AppInfoStorageKey' });

export const useAppInfoStore = create<AppInfoStore>()(
  devtools(withPersist, { name: 'AppInfoStorageKey' }),
);
