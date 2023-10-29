/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-fragments */
// ---Dependencys
import { ReactElement, Fragment, lazy, Suspense } from 'react';
import { Route, Routes as RouteProv } from 'react-router-dom';
// ---Components
// ---Pages
const HomePage = lazy(() => import('src/pages/Home/Home'));
const Page404 = lazy(() => import('src/pages/Page404/Page404'));

/**
 * Routes Component: Representar componentes como rutas de la aplicación, también es la raíz de toda la aplicación,
 * Obtenga datos útiles como el tamaño de la ventana de la aplicación, la ruta actual y recupere los datos para redux
 * @returns {ReactElement} ReactElement
 */
export function Routes(): ReactElement {
  return (
    <Fragment>
      <Suspense fallback={<h3>Loading...</h3>}>
        <RouteProv>
          <Route path='/' element={<HomePage />} />
          <Route path='*' element={<Page404 />} />
        </RouteProv>
      </Suspense>
    </Fragment>
  );
}
