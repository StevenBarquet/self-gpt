// ---Dependencys
import { ReactElement } from 'react';
import style from './HomeCont.module.scss';
import { RoutingRules } from 'src/providers/RoutingRules/RoutingRules';
import { Layout } from 'src/layout/Layout';
import { useAppLogicStore } from 'src/store/appLogic';
import { Chat } from './Chat/Chat';

const screens = {
  empty: <p>Select a GPT or Chat from menu</p>,
  gptConversation: <Chat />,
  gptCreate: <p>Crear GPT</p>,
  chat: <Chat />,
};

/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES

  const { mainScreen } = useAppLogicStore();
  // -----------------------MAIN METHODS

  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Layout>
      <RoutingRules className={style['HomeCont']}>{screens[mainScreen]}</RoutingRules>
    </Layout>
  );
}
