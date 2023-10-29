// ---Dependencies
import { ConfigProvider } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/**
 * AntdProv Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function AntdProv({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return <ConfigProvider theme={undefined}>{children}</ConfigProvider>;
}
