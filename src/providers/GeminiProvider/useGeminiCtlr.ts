import { type Content, GoogleGenAI } from '@google/genai';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Message } from 'src/database/Messages/definitions';
import { usePanelActions } from 'src/layout/Panel/usePanelActions';
import { FORMAT_CONTEXT } from 'src/SUPPORTED_MODELS';
import { useAppLogicStore } from 'src/store/appLogic';
import { useKeysStore } from 'src/store/keys';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiError } from 'src/utils/functions/alertUtils';
import type { WithId } from 'src/utils/functions/typesUtils';
import { useInput } from 'src/utils/hooks/useInput';

interface Props {
  reloadChatMsgs: () => void;
}

/**
 * Descripción: Equivalente de useOpenAiCtlr usando el SDK de Gemini (@google/genai).
 * Devuelve la misma forma (métodos y estados) para poder intercambiarlos en la UI.
 */
export function useGeminiCtlr({ reloadChatMsgs }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { onClickConversation } = usePanelActions([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [completionCtrl, setCompletionCtrl] = useState<AbortController>();
  const {
    allMessages,
    selectedGpt,
    selectedModel,
    selectedConversation,
    aiAnswer,
    Conversations,
    setAiAnswer,
    update,
  } = useAppLogicStore();

  const { GEMINI_API_KEY } = useKeysStore();
  const { createUserChat, addContext, deleteMessagesFrom, populateConversations } = useSupabase();

  const ai = useMemo(() => new GoogleGenAI({ apiKey: GEMINI_API_KEY }), [GEMINI_API_KEY]);
  const inputCtlr = useInput();
  const editingMessageRef = useRef<WithId<Message> | null>(null);

  const [ctxCheck, setCtxCheck] = useState(true);
  const lastCtxCheck = copyLastContext();

  useEffect(() => {
    if (editingMessageRef.current) {
      editingMessageRef.current = null;
      inputCtlr.setValue('');
    }
  }, [selectedConversation, selectedGpt]);

  // -----------------------MAIN METHODS

  async function ondAsk() {
    try {
      const editingMsg = editingMessageRef.current;
      if (editingMsg) {
        await deleteMessagesFrom(editingMsg.conversation, editingMsg.timestamp);
        editingMessageRef.current = null;
      }

      const { isNewChat } = validateMessages();
      const questionDate = preAskCleanAndDate();
      const controller = new AbortController();
      const { signal } = controller;
      setCompletionCtrl(controller);

      const currentMessages = useAppLogicStore.getState().allMessages;
      const context = (currentMessages ?? [])
        .filter((e) => e.context)
        .filter((e) => !editingMsg || e.timestamp < editingMsg.timestamp);

      const { systemInstruction, contents } = toGeminiRequest(context, inputCtlr.value);

      const stream = await ai.models.generateContentStream({
        model: selectedModel,
        contents,
        config: { systemInstruction, abortSignal: signal },
      });

      const chunks: string[] = [];
      let lastFlush = 0;

      const flush = () => {
        update({ aiAnswer: chunks.join('') }); // join una sola vez por flush
      };

      for await (const chunk of stream) {
        const part = chunk.text;
        if (part) chunks.push(part);

        const now = performance.now();
        if (now - lastFlush > 500) {
          flush();
          lastFlush = now;
        }
      }
      flush(); // final

      // Si llegamos aquí ya terminó y respondió
      setCompletionCtrl(undefined);
      const { id, gpt_base } = await getConversationInfo(isNewChat);

      const answerDate = new Date().toISOString();

      const question: Message = {
        content: inputCtlr.value!,
        gpt: gpt_base!,
        context: ctxCheck,
        model: selectedModel,
        role: 'user',
        conversation: id,
        original_context: false,
        timestamp: questionDate,
      };
      const answer: Message = {
        content: chunks.join(''),
        gpt: gpt_base!,
        context: ctxCheck,
        model: selectedModel,
        role: 'assistant',
        conversation: id,
        original_context: false,
        is_image_prompt: false,
        timestamp: answerDate,
      };

      await addContext([question, answer]);

      postSuccessQuestion(isNewChat, id);
    } catch (error: any) {
      console.log(error);
      // Expected when user stops generation
      await swalApiError(error?.message || 'Error al conectarse con Gemini');
      update({ aiAnswer: '' });
      setCompletionCtrl(undefined);
    } finally {
      setChatLoading(false);
    }
  }
  function stopGeneration() {
    if (completionCtrl) {
      completionCtrl.abort();
    }
  }

  function onEditQuestion(message: WithId<Message>) {
    editingMessageRef.current = message;
    inputCtlr.setValue(message.content);
  }

  function cancelEdit() {
    editingMessageRef.current = null;
    inputCtlr.setValue('');
  }
  // -----------------------UTILS

  // /**Copia la bandera de contexto del último mensaje al siguiente prompt */
  function copyLastContext() {
    if (!allMessages) return;
    const messages = allMessages.filter((e) => !e.original_context);
    if (messages.length) {
      const lastMsgCtx = messages[messages.length - 1].context;
      return lastMsgCtx;
    }
    return;
  }
  // -----------------------AUX METHODS
  function validateMessages() {
    if (!allMessages?.length) {
      throw new Error('No hay mensajes o GPT sin contexto');
    }
    const notOriginalContext = allMessages.find((e) => !e.original_context);
    if (notOriginalContext) {
      return {
        isNewChat: false,
      };
    }
    return {
      isNewChat: true,
    };
  }

  function preAskCleanAndDate() {
    setAiAnswer(''); // Última respuesta
    setChatLoading(true); // Spinner carga On

    const questionDate = new Date().toISOString();
    return questionDate;
  }

  async function getConversationInfo(isNewChat: boolean) {
    if (isNewChat) {
      const newConversation = await createUserChat({
        name: inputCtlr.value!,
        gpt_base: selectedGpt!,
      });
      if (!newConversation) throw new Error('Create a conversation was not possible');
      return newConversation;
    }
    const conversation = Conversations.find((e) => e.id === selectedConversation);
    return conversation!;
  }

  async function postSuccessQuestion(isNewChat: boolean, conversationId: string) {
    inputCtlr.setValue('');
    if (isNewChat) {
      await populateConversations();
      onClickConversation(conversationId);
    } else {
      update({ aiAnswer: '' });
    }
    reloadChatMsgs();
  }

  // -----------------------HOOK DATA
  return {
    chatLoading,
    sdkLoading: !!completionCtrl,
    ondAsk,
    stopGeneration,
    onEditQuestion,
    cancelEdit,
    editingMessageRef,
    inputCtlr,
    aiAnswer,
    ctxCtlr: {
      value: ctxCheck,
      lastCtxCheck,
      toggle: () => setCtxCheck((s) => !s),
    },
  };
}

export type GeminiCtlr = ReturnType<typeof useGeminiCtlr>;

// -----------------------HELPERS

const isSystemRole = (role: Message['role']) => role === 'system' || role === 'developer';

/**
 * Traduce el historial (formato OpenAI guardado en Supabase) al formato de Gemini:
 * - Los mensajes 'system' / 'developer' (FORMAT_CONTEXT + contexto original del GPT) van a
 *   `systemInstruction`, ya que Gemini no acepta ese rol dentro de `contents`.
 * - 'assistant' → 'model'; el resto → 'user'.
 * - Se agrega al final el prompt actual del usuario.
 */
function toGeminiRequest(context: Pick<Message, 'role' | 'content'>[], prompt: string) {
  const formatInstructions = FORMAT_CONTEXT.map((m) =>
    typeof m.content === 'string' ? m.content : '',
  );
  const gptInstructions = context.filter((m) => isSystemRole(m.role)).map((m) => m.content);

  const systemInstruction = [...formatInstructions, ...gptInstructions]
    .filter(Boolean)
    .join('\n\n');

  const contents: Content[] = context
    .filter((m) => !isSystemRole(m.role))
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  contents.push({ role: 'user', parts: [{ text: prompt }] });

  return { systemInstruction, contents };
}
