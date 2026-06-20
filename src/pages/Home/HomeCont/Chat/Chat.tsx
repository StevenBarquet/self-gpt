// ---Dependencies
import { useContext } from 'react';
// ---Components
import { Spinner } from 'src/common/Spinner/Spinner';
import { OpenAiContext } from 'src/providers/OpenAiProvider/OpenAiProvider';
import { Answer } from './Answer/Answer';
import { ChatInput } from './ChatInput/ChatInput';
import { ChatStart } from './ChatStart/ChatStart';
import { Question } from './Question/Question';
// ---Config
import { useAppLogicStore } from 'src/store/appLogic';
// ---Styles
import style from './Chat.module.scss';

export function Chat() {
  // -----------------------CONSTS, HOOKS, STATES
  const { chatCtlr, openAiCtlr } = useContext(OpenAiContext);
  const { isLoading, reloadChatMsgs, messages, bottomRef } = chatCtlr;
  const { inputCtlr, ondAsk, sdkLoading, chatLoading, stopGeneration, aiAnswer, ctxCtlr } =
    openAiCtlr;

  const { GPTs, selectedGpt, mainScreen } = useAppLogicStore();
  const currentGpt = mainScreen === 'gptConversation' ? GPTs.find((g) => g.id === selectedGpt) : undefined;
  const showSplash = currentGpt && (!messages || messages.length === 0) && !aiAnswer;

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Chat']}>
      {isLoading ? (
        <Spinner displayMessage={'Cargando...'} />
      ) : (
        <>
          {showSplash ? (
            <ChatStart gpt={currentGpt} />
          ) : (
            <>
              {messages?.map((e, i) =>
                e.role === 'assistant' ? (
                  <Answer reloadChatMsgs={reloadChatMsgs} message={e} key={`$answer-${i}`} />
                ) : (
                  <Question reloadChatMsgs={reloadChatMsgs} key={`$Question-${i}`} message={e} />
                ),
              )}
              <Answer reloadChatMsgs={reloadChatMsgs} aiAnswer={aiAnswer} key='answer-ai' />
            </>
          )}
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
