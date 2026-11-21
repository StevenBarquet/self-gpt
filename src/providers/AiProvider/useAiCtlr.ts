import { useEffect, useMemo, useRef, useState } from 'react';
// import {
//   IMAGE_GENERATED_DISPLAY_SIZE,
// IMAGE_KEYWORDS,
//   IMAGE_PROMPT_ENHANCER,
// } from 'src/appConfig/constants';
import type { Message } from 'src/database/Messages/definitions';
import { usePanelActions } from 'src/layout/Panel/usePanelActions';
import { getModelProvider } from 'src/SUPPORTED_MODELS';
import { useAppLogicStore } from 'src/store/appLogic';
import { useKeysStore } from 'src/store/keys';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiError } from 'src/utils/functions/alertUtils';
import type { WithId } from 'src/utils/functions/typesUtils';
import { useInput } from 'src/utils/hooks/useInput';
import { createStreamAdapters } from './streamAdapters';

interface Props {
  reloadChatMsgs: () => void;
}

/**
 * Descripción: Controlador del chat para todos los proveedores de IA. El estado (input, edición,
 * contexto, carga) es único; solo el SDK que ejecuta el prompt cambia según el modelo seleccionado.
 */
export function useAiCtlr({ reloadChatMsgs }: Props) {
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

  const { OPEN_AI_API_KEY, GEMINI_API_KEY } = useKeysStore();
  const { createUserChat, addContext, deleteMessagesFrom, populateConversations } = useSupabase();

  const streamAdapters = useMemo(
    () => createStreamAdapters({ OPEN_AI_API_KEY, GEMINI_API_KEY }),
    [OPEN_AI_API_KEY, GEMINI_API_KEY],
  );
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
      const provider = getModelProvider(selectedModel);
      const streamCompletion = streamAdapters[provider];
      // Antes de borrar mensajes en modo edición, para no perderlos si falta la key
      if (!streamCompletion) throw new Error(`No hay API key guardada para "${provider}"`);

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

      const stream = streamCompletion({
        model: selectedModel,
        context,
        prompt: inputCtlr.value,
        signal,
      });

      const chunks: string[] = [];
      let lastFlush = 0;

      const flush = () => {
        update({ aiAnswer: chunks.join('') }); // join una sola vez por flush
      };

      for await (const part of stream) {
        chunks.push(part);

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
        conversation: id, // Hay que cambiar este por la conversación actual o la que se crea
        original_context: false,
        timestamp: questionDate,
      };
      const answer: Message = {
        content: chunks.join(''),
        gpt: gpt_base!,
        context: ctxCheck,
        model: selectedModel,
        role: 'assistant',
        conversation: id, // Hay que cambiar este por la conversación actual o la que se crea
        original_context: false,
        is_image_prompt: false,
        timestamp: answerDate,
      };

      await addContext([question, answer]);

      postSuccessQuestion(isNewChat, id);

      // console.log({ result, allMessages });
    } catch (error: any) {
      console.log(error);
      // Expected when user stops generation
      await swalApiError(error?.message || 'Error al conectarse con el modelo');
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

  // async function generateImage(prompt: string) {
  //   try {
  //     setImageLoading(enhancedImages ? 'Enhancing prompt...' : '');
  //     // Flag para mejorar el prompt original de imagen
  //     const enhancedPrompt = enhancedImages
  //       ? await openai.chat.completions.create({
  //           messages: [{ role: 'user', content: IMAGE_PROMPT_ENHANCER(prompt) }],
  //           model: 'gpt-4o',
  //         })
  //       : { choices: [{ message: { content: prompt } }] };

  //     setImageLoading('Generating image...');
  //     const response = await openai.images.generate({
  //       prompt: enhancedPrompt.choices[0].message.content || prompt,
  //       n: 1,
  //       size: IMAGE_GENERATED_DISPLAY_SIZE,
  //     });
  //     setImageLoading('');

  //     return {
  //       url: response.data?.[0].url,
  //       prompt: enhancedPrompt.choices[0].message.content,
  //       enhanced: enhancedImages,
  //     };
  //   } catch (error) {
  //     setImageLoading('');
  //     console.error('Error generating image:', error);
  //   }
  // }

  // function isImagePrompt(prompt: string) {
  //   // Convertimos el prompt a minúsculas
  //   const lowerCasePrompt = prompt.toLowerCase();

  //   // Lista de keywords para detección de imagen

  //   // Verificamos si alguno de los keywords aparece en el prompt
  //   return IMAGE_KEYWORDS.some((keyword) => lowerCasePrompt.includes(keyword));
  // }

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

export type AiCtlr = ReturnType<typeof useAiCtlr>;
