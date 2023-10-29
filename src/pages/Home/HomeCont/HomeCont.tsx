// ---Dependencys
import { ReactElement } from 'react';
import style from './HomeCont.module.scss';
import { HelloWorld } from './HelloWorld/HelloWorld';
/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['HomeCont']}>
      <HelloWorld />
    </div>
  );
}
