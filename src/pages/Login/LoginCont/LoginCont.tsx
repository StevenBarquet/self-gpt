// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './LoginCont.module.scss';
import { ApiForm } from './ApiForm/ApiForm';
import { Start } from './Start/Start';
import { RoutingRules } from 'src/providers/RoutingRules/RoutingRules';

/**
 * LoginCont Component:  Descripción del comportamiento...
 */
export function LoginCont() {
  // -----------------------CONSTS, HOOKS, STATES
  const [start, setStart] = useState(false);
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <RoutingRules className={style['LoginCont']}>
      {start ? <ApiForm /> : <Start onClick={() => setStart(true)} />}
    </RoutingRules>
  );
}
