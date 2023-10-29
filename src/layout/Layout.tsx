// ---Dependencies
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar/Navbar';
import { Footer } from './Footer/Footer';

interface Props {
  children: ReactNode;
}

/**
 * Layout Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Layout({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
