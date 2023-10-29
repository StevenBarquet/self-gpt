// ---Dependencies
import React from 'react';
// ---Styles
import style from './Navbar.module.scss';
import { Frow, Fcol } from 'react-forge-grid';
import { customResponsive } from 'src/utils/functions/responsiveUtils';
import { Link } from 'react-router-dom';

/**
 * Navbar Component:  Descripción del comportamiento...
 */
export function Navbar() {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <header className={style.Navbar}>
      <Frow>
        <Fcol {...customResponsive(40, 100)}>
          <Link to='/'>Home</Link>
        </Fcol>

        <Fcol {...customResponsive(15, 50)}>
          <Link to='/err'>Err</Link>
        </Fcol>
      </Frow>
    </header>
  );
}
