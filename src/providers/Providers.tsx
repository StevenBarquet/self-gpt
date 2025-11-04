// ---Dependencies
import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AntdProv } from './AntdProv/AntdProv';
import { OpenAiProvider } from './OpenAiProvider/OpenAiProvider';
import { RoutingRules } from './RoutingRules/RoutingRules';
import { useScreenBreakpoints } from './useScreenBreakpoints';

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
      <AntdProv>
        <OpenAiProvider>
          <RoutingRules>{children}</RoutingRules>
        </OpenAiProvider>
      </AntdProv>
    </BrowserRouter>
  );
}
