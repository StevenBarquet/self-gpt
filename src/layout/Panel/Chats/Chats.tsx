// ---Dependencies
import React from 'react';
// ---Styles
import style from './Chats.module.scss';
import { ChatCard } from './ChatCard/ChatCard';
import { useAppLogicStore } from 'src/store/appLogic';
import { usePanelActions } from '../usePanelActions';

/**
 * Chats Component:  Descripción del comportamiento...
 */
export function Chats() {
  // -----------------------CONSTS, HOOKS, STATES
  const { Conversations, selectedConversation, GPTs } = useAppLogicStore();
  const userConversations = Conversations.filter((e) => !e.gptonly); // Filtramos por
  const { onClickConversation } = usePanelActions();

  const onGetGpt = (id: string) => {
    const result = GPTs.find((e) => e.id === id);

    return result;
  };
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Chats']}>
      {userConversations.map((e, i) => (
        <ChatCard
          key={`GptCard-${i}`}
          {...e}
          onClickConversation={onClickConversation}
          isActive={selectedConversation === e.id}
          onGetGpt={onGetGpt}
        />
      ))}
    </div>
  );
}
