// ---Dependencies
import React from 'react';
// ---Styles
import style from './Gpts.module.scss';
import { useAppLogicStore } from 'src/store/appLogic';
import { GptCard } from './GptCard/GptCard';

/**
 * Gpts Component:  Descripción del comportamiento...
 */
export function Gpts() {
  // -----------------------CONSTS, HOOKS, STATES
  const { GPTs } = useAppLogicStore();
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Gpts']}>
      {GPTs.map((e, i) => (
        <GptCard key={`GptCard-${i}`} {...e} />
      ))}
    </div>
  );
}
