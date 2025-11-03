// ---Dependencies
import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AntdProv } from './AntdProv/AntdProv';
import { useScreenBreakpoints } from './useScreenBreakpoints';
import { OpenAiProvider } from './OpenAiProvider/OpenAiProvider';
import { RoutingRules } from './RoutingRules/RoutingRules';

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
