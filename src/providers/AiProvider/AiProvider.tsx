// ---Dependencies
import type React from 'react';
import { createContext, type ReactElement } from 'react';
// ---Custom Hooks
import { useKeysStore } from 'src/store/keys';
import { type AiCtlr, useAiCtlr } from './useAiCtlr';
import { type ChatCtlr, useChatCtlr } from './useChatCtlr';

interface Props {
  children: React.ReactNode;
}

export const AiContext = createContext<{
  aiCtlr: AiCtlr;
  chatCtlr: ChatCtlr;
}>({
  aiCtlr: {} as unknown as AiCtlr,
  chatCtlr: {} as unknown as ChatCtlr,
});

/**
 * AiProvider Component: Un solo controlador de chat para OpenAI y Gemini. El SDK se elige en cada
 * pregunta según el modelo seleccionado (ver getModelProvider en SUPPORTED_MODELS).
 */
function TrueAiProvider({ children }: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const chatCtlr = useChatCtlr();
  const aiCtlr = useAiCtlr({
    reloadChatMsgs: chatCtlr.reloadChatMsgs,
  });
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return <AiContext.Provider value={{ chatCtlr, aiCtlr }}>{children}</AiContext.Provider>;
}

export function AiProvider({ children }: Props): ReactElement {
  const { OPEN_AI_API_KEY, GEMINI_API_KEY } = useKeysStore();
  if (OPEN_AI_API_KEY?.length || GEMINI_API_KEY?.length)
    return <TrueAiProvider>{children}</TrueAiProvider>;
  return <>{children}</>;
}
