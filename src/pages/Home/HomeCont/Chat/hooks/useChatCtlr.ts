import { useCallback, useEffect, useMemo, useState } from 'react';
import { Message } from 'src/database/Messages/definitions';
import { useAppLogicStore } from 'src/store/appLogic';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiError } from 'src/utils/functions/alertUtils';
import { WithId } from 'src/utils/functions/typesUtils';

const CHAT_TYPES = {
  /**Sin chat previo (selectedConversation) */
  EMPTY_NEW: 'EMPTY_NEW',
  /**Recién creada */
  JUST_CREATED: 'JUST_CREATED',
  /**Chat existente previamente (mensajes no se han cargado) */
  EMPTY_EXISTING: 'EMPTY_EXISTING',
  /**Chat existente previamente */
  EXISTING: 'EXISTING',
  /**Cambio a un chat existente */
  EXISTING_SWITCH: 'EXISTING_SWITCH',
};

type IChatTypes = keyof typeof CHAT_TYPES;

/** Descripción:  */
export function useChatCtlr() {
  // -----------------------CONSTS, HOOKS, STATES
  const { mainScreen, selectedConversation, GPTs, selectedGpt, Conversations } = useAppLogicStore();

  const [allMessages, setAllMessages] = useState<WithId<Message>[]>();
  const messages = allMessages?.filter((e) => !e.originalcontext);

  const selectedConversationMemo = useMemo(() => selectedConversation, [selectedConversation]);
  const selectedGptMemo = useMemo(() => selectedGpt, [selectedGpt]);
  const reloadChatMsgs = useCallback(reloadChat, [selectedGpt, selectedConversation]);
  useEffect(() => reloadChatMsgs(), [selectedConversationMemo, selectedGptMemo]);

  const currentGpt = GPTs.find((e) => e.id === selectedGpt);
  const currentConversation = Conversations.find((e) => e.id === selectedConversation);

  const { getChat, isLoading } = useSupabase();

  const chatType: IChatTypes = getChatType(); // No sirve ni es util
  // -----------------------MAIN METHODS
  function getChatType(): IChatTypes {
    if (mainScreen === 'gptConversation' && !selectedConversation) return 'EMPTY_NEW';
    if (mainScreen === 'gptConversation' && !!messages?.length) return 'JUST_CREATED';
    if (mainScreen === 'chat' && !messages?.length) return 'EMPTY_EXISTING';
    return 'EXISTING';
  }

  function reloadChat() {
    // if (allMessages ) return; // Si ya hay mensajes cargados

    // Si existe conversación seleccionada
    if (currentConversation) {
      getChat(currentConversation.id).then((msgs) => {
        if (!msgs?.length) {
          swalApiError('Chat with empty messages');
          return;
        }
        const gpt = GPTs.find((e) => e.id === msgs[0].gpt)!; // Todos los mensajes en el chat tienen mismo gpt id
        getGptContext(gpt.conversation).then((ctx) => setAllMessages([...ctx!, ...msgs]));
        setAllMessages(msgs || []);
      });

      // Si existe GPT seleccionado
    } else {
      getGptContext().then((msgs) => setAllMessages(msgs || []));
    }
  }

  // -----------------------AUX METHODS
  async function getGptContext(conversationId?: string) {
    if (!currentGpt && !conversationId) return;
    const msgs = await getChat(currentGpt?.conversation || conversationId!);
    if (!msgs) {
      swalApiError('GPT with empty context');
      return;
    }
    return msgs;
  }
  // -----------------------HOOK DATA
  return {
    /** Supabase está cargando */
    isLoading,
    /** Mensajes en la conversación (incluyendo contexto del gpt) */
    allMessages,
    /** Mensajes en la conversación (sin contexto del gpt) */
    messages,
    chatType,
    currentGpt,
    currentConversation,
    setAllMessages,
    /** Recarga la conversación */
    reloadChatMsgs,
  };
}
