// ---Dependencies
import React, { useCallback, useEffect, useState } from 'react';
// ---Styles
import style from './Chat.module.scss';
import { useAppLogicStore } from 'src/store/appLogic';
import { ChatStart } from './ChatStart/ChatStart';
import { ChatInput } from './ChatInput/ChatInput';
import { useSupabase } from 'src/utils/app/useSupabase';
import { Spinner } from 'src/common/Spinner/Spinner';
import { WithId } from 'src/utils/functions/typesUtils';
import { Message } from 'src/database/Messages/definitions';
import OpenAI from 'openai';
import { useKeysStore } from 'src/store/keys';
import { Answer } from './Answer/Answer';
import { useInput } from 'src/utils/hooks/useInput';
import { swalApiError } from 'src/utils/functions/alertUtils';

/**
 * Chat Component:  Descripción del comportamiento...
 */
export function Chat() {
  // -----------------------CONSTS, HOOKS, STATES
  const [allMessages, setAllMessages] = useState<WithId<Message>[]>();
  const messages = allMessages?.filter((e) => !e.originalcontext);
  const { mainScreen, selectedContext, GPTs, selectedGpt, Conversations, selectedModel, update } =
    useAppLogicStore();
  const { OPEN_AI_API_KEY } = useKeysStore();
  const getInitialLoad = useCallback(initialLoad, [selectedGpt, selectedContext]);
  useEffect(() => getInitialLoad(), [getInitialLoad]);
  const { getChat, isLoading, createNewChat, addContext } = useSupabase();
  // const getMessages = useCallback(getMessagesLogic,[mainScreen]);
  const [currentGpt] = GPTs.filter((e) => e.id === selectedGpt);
  const [currentConversation] = Conversations.filter((e) => e.id === selectedContext);

  const openai = new OpenAI({ apiKey: OPEN_AI_API_KEY, dangerouslyAllowBrowser: true });
  const [aiAnswer, setAiAnswer] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const inputCtlr = useInput();
  const [prevQuestion, setPrevQuestion] = useState<string>();

  // -----------------------MAIN METHODS
  function initialLoad() {
    if (allMessages) return; // Si ya hay mensajes cargados
    if (currentConversation) {
      // Agrega logica de copia local para validar si cambiaron de conversacion
      getChat(currentConversation.id).then((messages) => {
        console.log(messages);
        setAllMessages(messages || []);
      });
    } else if (currentGpt) {
      // Igual
      getChat(currentGpt.conversation).then((messages) => {
        console.log(messages);
        setAllMessages(messages || []);
      });
    }
  }

  async function ondAsk() {
    try {
      setPrevQuestion(inputCtlr.value); // guarda pregunta previa
      const questionDate = new Date().toISOString();
      inputCtlr.setValue(''); // limpia input de pregunta
      setAiAnswer(''); // Última respuesta
      const stream = await openai.chat.completions.create({
        messages: [{ role: 'user', content: inputCtlr.value }],
        model: selectedModel,
        stream: true,
      });

      for await (const chunk of stream) {
        const message = chunk.choices[0]?.delta?.content || '';
        const cleanMsg = message === 'undefined' ? '' : message;
        setAiAnswer((s) => (s += cleanMsg));
      }
      // Si llegamos aquí ya terminó y respondió
      const newConversation = await createNewChat(); // Esto sólo sucede si es un nuevo chat
      console.log({ newConversation });

      if (!newConversation) throw new Error('Create a conversation was not possible');

      // Falta swichear a la tab de chats en el panel lateral
      // falta pulear data de los chats
      update({ selectedContext: newConversation?.id });

      const answerDate = new Date().toISOString();

      const question: Message = {
        content: prevQuestion!,
        gpt: selectedGpt!,
        context: false, // Se necesita controlar con un checkbox
        model: selectedModel,
        role: 'user',
        conversation: newConversation.id, // Hay que cambiar este por la conversación actual o la que se crea
        originalcontext: false,
        timestamp: questionDate,
      };
      const answer: Message = {
        content: aiAnswer!,
        gpt: selectedGpt!,
        context: false, // Se necesita controlar con un checkbox
        model: selectedModel,
        role: 'assistant',
        conversation: newConversation.id, // Hay que cambiar este por la conversación actual o la que se crea
        originalcontext: false,
        timestamp: answerDate,
      };

      const result = await addContext([question, answer]);
      if (result) setAllMessages((s) => (s ? [...s, ...result] : result));

      console.log({ result, allMessages });
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con OpenAi');
    }
  }
  // -----------------------AUX METHODS
  // function getMessagesLogic() {
  //   if(!selectedContext) return [];

  //   if(!currentGpt) return [];

  // }
  // -----------------------RENDER
  return (
    <div className={style['Chat']}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <ChatStart />

          {/** Respuesta actual */}
          <Answer text={aiAnswer} />
        </>
      )}
      <ChatInput {...inputCtlr} disable={isLoading || chatLoading} ondAsk={ondAsk} />
    </div>
  );
}
