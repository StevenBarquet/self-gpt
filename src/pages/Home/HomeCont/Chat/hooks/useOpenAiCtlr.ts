import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useState } from 'react';
import { Message } from 'src/database/Messages/definitions';
import { usePanelActions } from 'src/layout/Panel/usePanelActions';
import { useAppLogicStore } from 'src/store/appLogic';
import { useKeysStore } from 'src/store/keys';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiError } from 'src/utils/functions/alertUtils';
import { WithId } from 'src/utils/functions/typesUtils';
import { useInput } from 'src/utils/hooks/useInput';

interface Props {
  allMessages?: WithId<Message>[];
  reloadChatMsgs: () => void;
}

/**
 * Descripción:
 */
export function useOpenAiCtlr({ allMessages, reloadChatMsgs }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { onClickConversation } = usePanelActions();

  const [skdLoading, setSdkLoading] = useState(false);
  const {
    selectedGpt,
    selectedModel,
    selectedConversation,
    aiAnswer,
    setAiAnswer,
    accumulateAiAnswer,
    update,
  } = useAppLogicStore();

  const { OPEN_AI_API_KEY } = useKeysStore();
  const { createUserChat, addContext, populateConversations } = useSupabase();

  const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });
  const inputCtlr = useInput();

  const [ctxCheck, setCtxCheck] = useState(false);
  const lastCtxCheck = copyLastContext();

  // -----------------------MAIN METHODS

  async function ondAsk() {
    try {
      const { isNewChat } = validateMessages();
      const questionDate = preAskCleanAndDate();
      const context = allMessages
        ?.filter((e) => e.context)
        .map((e) => ({
          role: e.role,
          content: e.content,
        })) as unknown as ChatCompletionMessageParam[];

      const stream = await openai.chat.completions.create({
        messages: [...context, { role: 'user', content: inputCtlr.value }],
        model: selectedModel,
        stream: true,
      });

      let aiAnswerinMemory: string = '';

      for await (const chunk of stream) {
        const message = chunk.choices[0]?.delta?.content || '';
        const cleanMsg = message === 'undefined' ? '' : message;
        aiAnswerinMemory += cleanMsg;
        accumulateAiAnswer(cleanMsg);
      }

      // Si llegamos aquí ya terminó y respondió
      const conversationId = await getConversationId(isNewChat);

      const answerDate = new Date().toISOString();

      const question: Message = {
        content: inputCtlr.value!,
        gpt: selectedGpt!,
        context: ctxCheck,
        model: selectedModel,
        role: 'user',
        conversation: conversationId, // Hay que cambiar este por la conversación actual o la que se crea
        original_context: false,
        timestamp: questionDate,
      };
      const answer: Message = {
        content: aiAnswerinMemory!,
        gpt: selectedGpt!,
        context: ctxCheck,
        model: selectedModel,
        role: 'assistant',
        conversation: conversationId, // Hay que cambiar este por la conversación actual o la que se crea
        original_context: false,
        timestamp: answerDate,
      };

      await addContext([question, answer]);

      postSuccessQuestion(isNewChat, conversationId);

      // console.log({ result, allMessages });
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con OpenAi');
    } finally {
      setSdkLoading(false);
    }
  }

  // /**Copia la bandera de contexto del último mensaje al siguiente prompt */
  function copyLastContext() {
    if (!allMessages) return;
    const messages = allMessages.filter((e) => !e.original_context);
    if (!!messages.length) {
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
    setSdkLoading(true); // Spinner carga On

    const questionDate = new Date().toISOString();
    return questionDate;
  }

  async function getConversationId(isNewChat: boolean) {
    if (isNewChat) {
      const newConversation = await createUserChat({
        name: inputCtlr.value!,
        gpt_base: selectedGpt!,
      });
      if (!newConversation) throw new Error('Create a conversation was not possible');
      return newConversation.id;
    }
    return selectedConversation!;
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
    skdLoading,
    ondAsk,
    inputCtlr,
    aiAnswer,

    ctxCtlr: {
      value: ctxCheck,
      lastCtxCheck,
      toggle: () => setCtxCheck((s) => !s),
    },
  };
}
