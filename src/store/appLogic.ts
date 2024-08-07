import { Conversation } from 'src/database/Conversations/definitions';
import { GPT } from 'src/database/GPTs/definitions';
import { WithId } from 'src/utils/functions/typesUtils';
import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

export const MAIN_SCREENS = {
  empty: 'empty',
  gptConversation: 'gptConversation',
  gptCreate: 'gptCreate',
  chat: 'chat',
};

interface State {
  GPTs: WithId<GPT>[];
  Conversations: WithId<Conversation>[];
  mainScreen: keyof typeof MAIN_SCREENS;
  selectedContext?: string; // id de la conversación
  selectedModel: GPT['defaultmodel'];
  selectedGpt?: string; // id del gpt
  panelTab: 'gpts' | 'chats';
}

const initialState: State = {
  GPTs: [],
  Conversations: [],
  mainScreen: 'empty',
  selectedModel: 'gpt-4o-mini',
  panelTab: 'gpts',
};

export interface AppLogicStore extends State {
  update: (data: Partial<State>) => void;
  // updateNested: (key: keyof State, data: Partial<State>[keyof State]) => void;
  set: (data: State) => void;
  reset: () => void;
}

// Si quieres ocupar logica compleja, puedes manejar las actions en otro archivo
const actions: StateCreator<AppLogicStore> = (set) => ({
  ...initialState,
  update: (data) => set((state) => ({ ...state, ...data })),
  // updateNested: (key, data) => set((state) => ({ ...state, [key]: { ...state[key], ...data } })),
  set: (data) => set(() => data),
  reset: () => set(() => initialState),
});

// ------------BOILERPLATE-----

export const useAppLogicStore = create<AppLogicStore>()(devtools(actions, { name: 'AppLogic' }));
