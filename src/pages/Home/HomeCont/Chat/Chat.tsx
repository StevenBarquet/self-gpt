// ---Dependencies
import { useContext } from 'react';
import { Spinner } from 'src/common/Spinner/Spinner';
import { OpenAiContext } from 'src/providers/OpenAiProvider/OpenAiProvider';
import { Answer } from './Answer/Answer';
// ---Styles
import style from './Chat.module.scss';
import { ChatInput } from './ChatInput/ChatInput';
import { Question } from './Question/Question';

/**
 * Chat Component:  Descripción del comportamiento...
 */
export function Chat() {
  // -----------------------CONSTS, HOOKS, STATES
  const { chatCtlr, openAiCtlr } = useContext(OpenAiContext); // Se movio al provider porque OpenAi necesitaba instanciarse singleton
  const { isLoading, reloadChatMsgs, messages, bottomRef } = chatCtlr;
  const { inputCtlr, ondAsk, sdkLoading, chatLoading, stopGeneration, aiAnswer, ctxCtlr } =
    openAiCtlr;

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Chat']}>
      {isLoading ? (
        <Spinner displayMessage={'Cargando...'} />
      ) : (
        <>
          {/* <ChatStart /> */}
          {messages?.map((e, i) =>
            e.role === 'assistant' ? (
              <Answer reloadChatMsgs={reloadChatMsgs} message={e} key={`$answer-${i}`} />
            ) : (
              <Question reloadChatMsgs={reloadChatMsgs} key={`$Question-${i}`} message={e} />
            ),
          )}
          {/** Respuesta actual */}
          <Answer reloadChatMsgs={reloadChatMsgs} aiAnswer={aiAnswer} key='answer-ai' />
        </>
      )}
      <ChatInput
        ctxCtlr={ctxCtlr}
        {...inputCtlr}
        stopGeneration={stopGeneration}
        sdkLoading={sdkLoading}
        chatLoading={chatLoading}
        ondAsk={ondAsk}
      />
      <div ref={bottomRef} />
    </div>
  );
}
