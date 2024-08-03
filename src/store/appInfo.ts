import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isMobile: boolean;
  winSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  width?: number;
  clientLoaded: boolean;
}

const initialState: State = {
  isMobile: false,
  clientLoaded: false,
};

export interface AppInfoStore extends State {
  update: (data: Partial<State>) => void;
  updateNested: (key: keyof State, data: Partial<State>[keyof State]) => void;
  set: (data: State) => void;
  reset: () => void;
}

const actions: StateCreator<AppInfoStore> = (set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  updateNested: (key, data) => set((state) => ({ ...state, [key]: data })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----

export const useAppInfoStore = create<AppInfoStore>()(devtools(actions, { name: 'AppInfo' }));
