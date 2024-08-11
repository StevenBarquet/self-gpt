import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { Dispatch, useState } from 'react';
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
  setAllMessages: Dispatch<React.SetStateAction<WithId<Message>[] | undefined>>;
}

/**
 * Descripción:
 */
export function useOpenAiCtlr({ allMessages, setAllMessages }: Props) {
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
  } = useAppLogicStore();

  const { OPEN_AI_API_KEY } = useKeysStore();
  const { createNewChat, addContext } = useSupabase();

  const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });
  const inputCtlr = useInput();

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

      for await (const chunk of stream) {
        const message = chunk.choices[0]?.delta?.content || '';
        const cleanMsg = message === 'undefined' ? '' : message;
        accumulateAiAnswer(cleanMsg);
      }
      // Si llegamos aquí ya terminó y respondió
      const conversationId = await getConversationId(isNewChat);

      const answerDate = new Date().toISOString();

      const question: Message = {
        content: inputCtlr.value!,
        gpt: selectedGpt!,
        context: false, // Se necesita controlar con un checkbox
        model: selectedModel,
        role: 'user',
        conversation: conversationId, // Hay que cambiar este por la conversación actual o la que se crea
        originalcontext: false,
        timestamp: questionDate,
      };
      const answer: Message = {
        content: aiAnswer!,
        gpt: selectedGpt!,
        context: false, // Se necesita controlar con un checkbox
        model: selectedModel,
        role: 'assistant',
        conversation: conversationId, // Hay que cambiar este por la conversación actual o la que se crea
        originalcontext: false,
        timestamp: answerDate,
      };

      const result = await addContext([question, answer]);
      if (result) setAllMessages((s) => (s ? [...s, ...result] : result));

      postSuccessQuestion(isNewChat, conversationId);

      console.log({ result, allMessages });
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con OpenAi');
    } finally {
      setSdkLoading(false);
    }
  }
  // -----------------------AUX METHODS
  function validateMessages() {
    if (!allMessages?.length) {
      throw new Error("No hay mensajes o GPT sin contexto'");
    }
    const notOriginalContext = allMessages.find((e) => !e.originalcontext);
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
    console.log(2);
    console.log({ inputValue: inputCtlr.value, skdLoading, aiAnswer });

    const questionDate = new Date().toISOString();
    return questionDate;
  }

  async function getConversationId(isNewChat: boolean) {
    if (isNewChat) {
      const newConversation = await createNewChat({
        name: inputCtlr.value!,
        gpt_base: selectedGpt!,
      });
      if (!newConversation) throw new Error('Create a conversation was not possible');
      return newConversation.id;
    }
    return selectedConversation!;
  }

  function postSuccessQuestion(isNewChat: boolean, conversationId: string) {
    inputCtlr.setValue('');
    if (isNewChat) {
      onClickConversation(conversationId);
    }
  }

  // -----------------------HOOK DATA
  return {
    skdLoading,
    ondAsk,
    inputCtlr,
    aiAnswer,
  };
}
