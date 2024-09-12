// ---Dependencies
import React from 'react';
// ---Styles
import style from './Chat.module.scss';
import { ChatInput } from './ChatInput/ChatInput';

import { Spinner } from 'src/common/Spinner/Spinner';
import { Answer } from './Answer/Answer';
import { useChatCtlr } from './hooks/useChatCtlr';
import { useOpenAiCtlr } from './hooks/useOpenAiCtlr';
import { Question } from './Question/Question';

/**
 * Chat Component:  Descripción del comportamiento...
 */
export function Chat() {
  // -----------------------CONSTS, HOOKS, STATES
  const { allMessages, isLoading, reloadChatMsgs, messages, bottomRef } = useChatCtlr();
  const { inputCtlr, ondAsk, skdLoading, aiAnswer, ctxCtlr } = useOpenAiCtlr({
    allMessages,
    reloadChatMsgs,
  });

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Chat']}>
      {isLoading ? (
        <Spinner />
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
        disable={isLoading || skdLoading}
        ondAsk={ondAsk}
      />
      <div ref={bottomRef} />
    </div>
  );
}
