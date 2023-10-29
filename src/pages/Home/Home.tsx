/* eslint-disable no-restricted-syntax */
// ---Dependencys
import { ReactElement } from 'react';
import { Helmet } from 'react-helmet';
// ---Components
import { HomeCont } from 'src/pages/Home/HomeCont/HomeCont';

/**
 * Componente HomePage: este componente es para dar datos al Helmet de
 * la página y concatenarla con el contenedor de la página componente
 * @returns { ReactElement } ReactElement
 */
export default function Home(): ReactElement {
  return (
    <>
      <Helmet>
        <title>Inicio</title>
      </Helmet>
      <HomeCont />
    </>
  );
}
