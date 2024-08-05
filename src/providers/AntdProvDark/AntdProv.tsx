// ---Dependencies
import { ConfigProvider, theme } from 'antd';
import React, { ReactNode } from 'react';
import { appColors } from '../AntdProv/AntdProv';

interface Props {
  children: ReactNode;
}

/**
 * AntdProvDark Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function AntdProvDark({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: appColors.primaryColor || undefined,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
