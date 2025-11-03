// ---Dependencies
import type React from "react";
import { createContext } from "react";
import { useKeysStore } from "src/store/keys";
import { type ChatCtlr, useChatCtlr } from "./useChatCtlr";
import { type OpenAiCtlr, useOpenAiCtlr } from "./useOpenAiCtlr";

interface Props {
	children: React.ReactNode;
}

export const OpenAiContext = createContext<{
	openAiCtlr: OpenAiCtlr;
	chatCtlr: ChatCtlr;
}>({
	openAiCtlr: {} as unknown as OpenAiCtlr,
	chatCtlr: {} as unknown as ChatCtlr,
});

/**
 * OpenAiProvider Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
function TrueOpenAiProvider({ children }: Props) {
	// -----------------------CONSTS, HOOKS, STATES
	const chatCtlr = useChatCtlr();
	const openAiCtlr = useOpenAiCtlr({
		reloadChatMsgs: chatCtlr.reloadChatMsgs,
	});
	// -----------------------MAIN METHODS
	// -----------------------AUX METHODS
	// -----------------------RENDER
	return (
		<OpenAiContext.Provider value={{ chatCtlr, openAiCtlr }}>
			{children}
		</OpenAiContext.Provider>
	);
}

export function OpenAiProvider({ children }: Props) {
	const { OPEN_AI_API_KEY } = useKeysStore();
	if (OPEN_AI_API_KEY?.length)
		return <TrueOpenAiProvider>{children}</TrueOpenAiProvider>;
	return <>{children}</>;
}
