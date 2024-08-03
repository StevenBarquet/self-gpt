/* eslint-disable no-restricted-syntax */
// ---Dependencys
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
// ---Components
import { LoginCont } from 'src/pages/Login/LoginCont/LoginCont';

/**
 * Componente HomePage: este componente es para dar datos al Helmet de
 * la página y concatenarla con el contenedor de la página componente
 * @returns { ReactElement } ReactElement
 */
export default function Login(): ReactElement {
  return (
    <>
      <Helmet>
        <title>Self GPT - Same but private and pay as you go</title>
      </Helmet>
      <LoginCont />
    </>
  );
}
