import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    mainScreen,
    selectedConversation,
    GPTs,
    selectedGpt,
    Conversations,
    allMessages,
    currentPage,
    pageSize,
    update,
  } = useAppLogicStore();

  const filteredMessages = allMessages?.filter((e) => !e.original_context);
  const messages = filteredMessages?.slice((currentPage - 1) * pageSize, currentPage * pageSize); // Calcular mensajes a mostrar según la página actual
  const updateMessages = (msgs: WithId<Message>[]) => {
    const totalPages = Math.ceil(msgs.filter((e) => !e.original_context).length / pageSize);
    update({ allMessages: msgs, currentPage: totalPages });
  };
  const setAllMessages = useCallback(updateMessages, [updateMessages]);

  const selectedConversationMemo = useMemo(() => selectedConversation, [selectedConversation]);
  const selectedGptMemo = useMemo(() => selectedGpt, [selectedGpt]);
  const reloadChatMsgs = useCallback(reloadChat, [selectedGpt, selectedConversation]);
  useEffect(() => reloadChatMsgs(), [selectedConversationMemo, selectedGptMemo]);

  const currentGpt = GPTs.find((e) => e.id === selectedGpt);
  const currentConversation = Conversations.find((e) => e.id === selectedConversation);

  const { getChat, getContextConversation, isLoading } = useSupabase();

  const chatType: IChatTypes = getChatType(); // No sirve ni es util
  // -----------------------MAIN METHODS
  function getChatType(): IChatTypes {
    if (mainScreen === 'gptConversation' && !selectedConversation) return 'EMPTY_NEW';
    if (mainScreen === 'gptConversation' && !!messages?.length) return 'JUST_CREATED';
    if (mainScreen === 'chat' && !messages?.length) return 'EMPTY_EXISTING';
    return 'EXISTING';
  }

  /**
   * Reloads the messages in the chat.
   * It first checks if there is a selected conversation. If so, it calls the Supabase `getChat` function to retrieve the messages.
   * If there are no messages, it shows an alert. If there are messages, it finds the first GPT id and calls the Supabase `getGptContext` function to retrieve the context.
   * It then combines the context and the messages and sets the new value to the `allMessages` state.
   * If there is no selected conversation, it simply calls the `getGptContext` function to retrieve the messages.
   * Finally, it sets the retrieved messages to the `allMessages` state.
   */
  function reloadChat() {
    // Si existe conversación seleccionada
    if (currentConversation) {
      getChat(currentConversation.id).then(async (msgs) => {
        // Validation
        if (!msgs?.length) {
          swalApiError('Chat with empty messages');
          return;
        }

        // Set messages
        const gpt = GPTs.find((e) => e.id === msgs[0].gpt)!;
        const ctxConversation = await getContextConversation(gpt);

        const ctx = await getGptContext(ctxConversation?.id);
        if (!ctx) {
          swalApiError('GPT with empty context');
          return;
        }
        setAllMessages([...ctx, ...msgs]);

        // setAllMessages(msgs || []);
      });

      // Si existe GPT seleccionado
    } else if (currentGpt) {
      getContextConversation(currentGpt).then(async (ctxConversation) => {
        const ctx = await getGptContext(ctxConversation?.id);
        if (!ctx) {
          swalApiError('GPT with empty context');
          return;
        }
        setAllMessages(ctx);
      });
    } else {
      swalApiError('Invalid chat or GPT selected');
    }
  }

  function scrollToBottom() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView(true);
    }
  }
  useEffect(() => scrollToBottom(), [allMessages, currentPage, pageSize]);

  // -----------------------AUX METHODS
  async function getGptContext(conversationId?: string) {
    if (!conversationId) return;
    const msgs = await getChat(conversationId!);
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
    /**Ref que debe vincularse a un div del bottom del chat */
    bottomRef,
    chatType,
    currentGpt,
    currentConversation,
    setAllMessages,
    /** Recarga la conversación */
    reloadChatMsgs,
  };
}
