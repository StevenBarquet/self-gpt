// ---Dependencies
import React from 'react';
// ---Styles
import style from './Question.module.scss';

interface Props {
  text: string;
}

/**
 * Question Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Question({ text }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!text) return null;
  return (
    <div className={style['Question']}>
      <section>{text}</section>
    </div>
  );
}
