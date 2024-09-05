// ---Dependencies
import React from 'react';
// ---Styles
import style from './PanelTitle.module.scss';
import { Button } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  title: string;
  toggleSelectAll: () => void;
}

/**
 * PanelTitle Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function PanelTitle({ title, toggleSelectAll }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['PanelTitle']}>
      <Button block type='text' icon={<Icon icon='tabler:select' />} onClick={toggleSelectAll}>
        {title}
      </Button>
    </div>
  );
}
