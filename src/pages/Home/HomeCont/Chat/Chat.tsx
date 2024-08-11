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
  const { allMessages, isLoading, setAllMessages, messages } = useChatCtlr();
  const { inputCtlr, ondAsk, skdLoading, aiAnswer } = useOpenAiCtlr({
    allMessages,
    setAllMessages,
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
              <Answer text={e.content} key={`$answer-${i}`} />
            ) : (
              <Question key={`$Question-${i}`} text={e.content} />
            ),
          )}
          {/** Respuesta actual */}
          <Answer text={aiAnswer} />
        </>
      )}
      <ChatInput {...inputCtlr} disable={isLoading || skdLoading} ondAsk={ondAsk} />
    </div>
  );
}
