// ---Dependencies
import React from 'react';
// ---Styles
import style from './Spinner.module.scss';
import { Icon } from '@iconify/react';

interface Props {
  isLoading?: boolean;
}

/**
 * Spinner Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Spinner({ isLoading = true }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!isLoading) return null;
  return (
    <div className={style['Spinner']}>
      <Icon icon='ant-design:loading-outlined' />
    </div>
  );
}
