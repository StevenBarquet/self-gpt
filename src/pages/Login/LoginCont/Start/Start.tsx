// ---Dependencies
import React from 'react';
// ---Styles
import style from './Start.module.scss';
import { Button } from 'antd';

interface Props {
  onClick: () => void;
}

/**
 * Start Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Start({ onClick }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Start']}>
      <h1>Self GPT</h1>
      <p>Same as others but...</p>
      <ul>
        <li>Pay as you go (no subscriptions)</li>
        <li>No data collection</li>
        <li>No trainers</li>
        <li>Completely private</li>
        <li>Non-profit project</li>
      </ul>
      <Button onClick={onClick}>Start</Button>
    </div>
  );
}
