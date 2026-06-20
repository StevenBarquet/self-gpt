// ---Dependencys
import { type ReactElement, useEffect } from 'react';
import { Layout } from 'src/layout/Layout';
import { useAppInfoStore } from 'src/store/appInfo';
import { useAppLogicStore } from 'src/store/appLogic';
import { usePreferencesStore } from 'src/store/preferences';
import { useSupabase } from 'src/utils/app/useSupabase';
import { Chat } from './Chat/Chat';
import { CreateGpt } from './CreateGpt/CreateGpt';
import { EmptyScreen } from './EmptyScreen/EmptyScreen';
import style from './HomeCont.module.scss';

const screens = {
  empty: <EmptyScreen />,
  gptConversation: <Chat />,
  gptCreate: <CreateGpt />,
  chat: <Chat />,
};

/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES

  const { mainScreen } = useAppLogicStore();
  const { lastConversation } = usePreferencesStore();
  const { getChat, populateGpts, populateConversations } = useSupabase();
  const { update } = useAppLogicStore();
  const { toggleCollapsed, isMobile } = useAppInfoStore();

  useEffect(() => {
    (async () => {
      await loadLastConversation();
    })();
  }, []);

  // -----------------------MAIN METHODS
  async function loadLastConversation() {
    if (mainScreen === 'empty' && !!lastConversation?.length) {
      const messages = await getChat(lastConversation);
      if (!messages?.length) return;
      // Si llegamos aquí, si existe la conversación y hay mensajes
      const lastMsg = messages[messages.length - 1];
      await Promise.all([populateGpts(), populateConversations()]);
      update({
        mainScreen: 'chat',
        selectedModel: lastMsg.model,
        selectedGpt: undefined,
        selectedConversation: lastConversation, // Limpia previa conversación seleccionada
        panelTab: 'chats', // Swichea a la tab del panel "chats"
        aiAnswer: '', // Limpia la última respuesta del chat
      });
      if (isMobile) toggleCollapsed();
    }
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Layout>
      <div className={style['HomeCont']}>{screens[mainScreen]}</div>
    </Layout>
  );
}
