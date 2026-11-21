// ---Dependencies
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AiProvider } from './AiProvider/AiProvider';
import { RoutingRules } from './RoutingRules/RoutingRules';
import { useScreenBreakpoints } from './useScreenBreakpoints';
import { AntdProvDark } from './AntdProvDark/AntdProv';

interface Props {
  children: ReactNode;
}

/**
 * Providers Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Providers({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  useScreenBreakpoints();
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <BrowserRouter>
      <AntdProvDark>
        <AiProvider>
          <RoutingRules>{children}</RoutingRules>
        </AiProvider>
      </AntdProvDark>
    </BrowserRouter>
  );
}
