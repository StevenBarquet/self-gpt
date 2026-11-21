// ---Dependencies
import type React from 'react';
import { createContext, useContext } from 'react';
import { useKeysStore } from 'src/store/keys';
import { OpenAiContext } from '../OpenAiProvider/OpenAiProvider';
import type { ChatCtlr } from '../OpenAiProvider/useChatCtlr';
import { type GeminiCtlr, useGeminiCtlr } from './useGeminiCtlr';

interface Props {
  children: React.ReactNode;
}

export const GeminiContext = createContext<{
  geminiCtlr: GeminiCtlr;
  chatCtlr: ChatCtlr;
}>({
  geminiCtlr: {} as unknown as GeminiCtlr,
  chatCtlr: {} as unknown as ChatCtlr,
});

/**
 * GeminiProvider Component: Equivalente de OpenAiProvider para modelos de Gemini.
 * El chatCtlr (mensajes de Supabase) no depende del proveedor de IA, así que se reutiliza el de
 * OpenAiContext en vez de crear otro (evita cargar dos veces los mensajes en cada cambio de chat).
 */
function TrueGeminiProvider({ children, chatCtlr }: Props & { chatCtlr: ChatCtlr }) {
  // -----------------------CONSTS, HOOKS, STATES
  const geminiCtlr = useGeminiCtlr({
    reloadChatMsgs: chatCtlr.reloadChatMsgs,
  });
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <GeminiContext.Provider value={{ chatCtlr, geminiCtlr }}>{children}</GeminiContext.Provider>
  );
}

/** Debe ir dentro de <OpenAiProvider> para compartir su chatCtlr */
export function GeminiProvider({ children }: Props) {
  const { GEMINI_API_KEY } = useKeysStore();
  const { chatCtlr } = useContext(OpenAiContext);
  // Sin OPEN_AI_API_KEY, OpenAiContext trae el valor por defecto ({}) y no hay chatCtlr real
  if (GEMINI_API_KEY?.length && typeof chatCtlr.reloadChatMsgs === 'function')
    return <TrueGeminiProvider chatCtlr={chatCtlr}>{children}</TrueGeminiProvider>;
  return <>{children}</>;
}
