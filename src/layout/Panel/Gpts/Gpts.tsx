// ---Dependencies
import React from 'react';
// ---Styles
import style from './Gpts.module.scss';
import { useAppLogicStore } from 'src/store/appLogic';
import { GptCard } from './GptCard/GptCard';
import { usePanelActions } from '../usePanelActions';

/**
 * Gpts Component:  Descripción del comportamiento...
 */
export function Gpts() {
  // -----------------------CONSTS, HOOKS, STATES
  const { GPTs, selectedGpt } = useAppLogicStore();
  const { onClickGpt } = usePanelActions();
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['Gpts']}>
      {GPTs.map((e, i) => (
        <GptCard
          key={`GptCard-${i}`}
          {...e}
          onClickGpt={onClickGpt}
          isActive={selectedGpt === e.id}
        />
      ))}
    </div>
  );
}
