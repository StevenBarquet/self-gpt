// ---Dependencies
import React from 'react';
// ---Styles
import style from './DynamicIcon.module.scss';

interface Props {
  icon: string;
}

/**
 * DynamicIcon Component:  Recibe un SVG de https://icon-sets.iconify.design
 */
export function DynamicIcon({ icon }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return <div className={style['DynamicIcon']} dangerouslySetInnerHTML={{ __html: icon }}></div>;
}
