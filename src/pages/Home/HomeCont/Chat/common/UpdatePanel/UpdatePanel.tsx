// ---Dependencies
import React from 'react';
// ---Styles
import style from './UpdatePanel.module.scss';
import { Switch } from 'antd';
import { CopyButton } from 'src/common/CopyButton/CopyButton';

interface Props {
  content: string;
}

/**
 * UpdatePanel Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function UpdatePanel({ content }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['UpdatePanel']}>
      <div className='check'>
        In Context: <Switch />
      </div>
      <CopyButton toCopy={content} />
    </div>
  );
}
