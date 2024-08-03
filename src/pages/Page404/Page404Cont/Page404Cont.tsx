// ---Dependencies
import React from 'react';
// ---Styles
import style from './Page404Cont.module.scss';
import { RoutingRules } from 'src/providers/RoutingRules/RoutingRules';

/**
 * Page404Cont Component:  Descripción del comportamiento...
 */
export function Page404Cont() {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <RoutingRules className={style['Page404Cont']}>
      <h1>Ups!</h1>
      <h2>Pagina no Encontrada</h2>
    </RoutingRules>
  );
}
