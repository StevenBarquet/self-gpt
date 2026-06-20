// ---Dependencies
import type { ReactElement } from 'react';
// ---Styles
import style from './EmptyScreen.module.scss';

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <path d="M50 12C28 12 14 26 14 44c0 10 4.5 18.5 12 24.5V80l12-8c3.5 1.3 8 2 12 2c22 0 36-14 36-30S72 12 50 12z" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
  <path d="M30 38h40" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.9"/>
  <path d="M30 50h28" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
  <path d="M30 62h18" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" opacity="0.35"/>
</svg>`;

export function EmptyScreen(): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style.EmptyScreen}>
      <div className="logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
      <h1>Self GPT</h1>
      <p>Selecciona un GPT o inicia una conversación</p>
    </div>
  );
}
