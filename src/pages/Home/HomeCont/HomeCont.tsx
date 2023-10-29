// ---Dependencys
import { ReactElement } from 'react';
import { Button } from 'antd';
import style from './HomeCont.module.scss';
import { HelloWorld } from './HelloWorld/HelloWorld';
import { useAppInfoStore } from 'src/store/appInfo';
/**
 * HomeCont Component: Contenedor principal donde se construye todo el contenido de la pagina
 * @returns {ReactElement} ReactElement
 */
export function HomeCont(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { count, update } = useAppInfoStore();
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['HomeCont']}>
      count: {count}
      <Button onClick={() => update({ count: count + 1 })}>Increment</Button>
      <HelloWorld />
    </div>
  );
}
