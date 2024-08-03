// ---Dependencys
import { ReactElement } from 'react';
import style from './HomeCont.module.scss';
import { RoutingRules } from 'src/providers/RoutingRules/RoutingRules';
import { Layout } from 'src/layout/Layout';

/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Layout>
      <RoutingRules className={style['HomeCont']}>hello</RoutingRules>
    </Layout>
  );
}
