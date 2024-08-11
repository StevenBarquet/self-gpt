// ---Dependencies
import React from 'react';
// ---Styles
import style from './Chats.module.scss';
import { ChatCard } from './ChatCard/ChatCard';
import { useAppLogicStore } from 'src/store/appLogic';
import { usePanelActions } from '../usePanelActions';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm } from 'src/utils/functions/alertUtils';

/**
 * Chats Component:  Descripción del comportamiento...
 */
export function Chats() {
  // -----------------------CONSTS, HOOKS, STATES
  const { Conversations, selectedConversation, GPTs, update } = useAppLogicStore();
  const userConversations = Conversations.filter((e) => !e.gptonly); // Filtramos por
  const { onClickConversation } = usePanelActions();
  const { deleteConversation } = useSupabase();

  const onGetGpt = (id: string) => {
    const result = GPTs.find((e) => e.id === id);

    return result;
  };

  const onDelete = (id: string) => {
    swalApiConfirm({
      callback: async () => {
        update({ mainScreen: 'empty' });
        await deleteConversation(id);
      },
      successMsg: 'Chat deleted successfully',
    });
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
          onDelete={onDelete}
          isActive={selectedConversation === e.id}
          onGetGpt={onGetGpt}
        />
      ))}
    </div>
  );
}
