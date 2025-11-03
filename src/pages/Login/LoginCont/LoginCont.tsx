// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './LoginCont.module.scss';
import { ApiForm } from './ApiForm/ApiForm';
import { Start } from './Start/Start';

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
    <div className={style['LoginCont']}>
      {start ? (
        <ApiForm goBack={() => setStart(false)} />
      ) : (
        <Start onClick={() => setStart(true)} />
      )}
    </div>
  );
}
