import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isMobile: boolean;
  winSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  width?: number;
  menuCollapsed: boolean;
  clientLoaded: boolean;
}

const initialState: State = {
  isMobile: false,
  clientLoaded: false,
  menuCollapsed: true,
};

export interface AppInfoStore extends State {
  update: (data: Partial<State>) => void;
  toggleCollapsed: () => void;
  updateNested: (key: keyof State, data: Partial<State>[keyof State]) => void;
  set: (data: State) => void;
  reset: () => void;
}

const actions: StateCreator<AppInfoStore> = (set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  toggleCollapsed: () => set((state) => ({ ...state, menuCollapsed: !state.menuCollapsed })),
  updateNested: (key, data) => set((state) => ({ ...state, [key]: data })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----

export const useAppInfoStore = create<AppInfoStore>()(devtools(actions, { name: 'AppInfo' }));
