// ---Dependencies
import React, { ReactNode } from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { Icon } from '@iconify/react';
import { useAppInfoStore } from 'src/store/appInfo';
import style from './Layout.module.scss';
import { Panel } from './Panel/Panel';
import { AntdProvDark } from 'src/providers/AntdProvDark/AntdProv';
import { ModelSelector } from './ModelSelector/ModelSelector';
import { MessagesPagination } from './MessagesPagination/MessagesPagination';

const { Header, Sider, Content } = AntLayout;

interface Props {
  children: ReactNode;
}

/**
 * Layout Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Layout({ children }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { isMobile, menuCollapsed, toggleCollapsed } = useAppInfoStore();
  const isExpandedMobile = isMobile && !menuCollapsed;
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <AntLayout className={style['Layout']}>
      <AntdProvDark>
        <Sider
          width={isMobile ? '82%' : 470}
          collapsedWidth={isMobile ? 20 : undefined}
          trigger={null}
          collapsible
          collapsed={menuCollapsed}
        >
          {menuCollapsed ? null : <Panel />}
        </Sider>
      </AntdProvDark>
      <AntLayout>
        <Header>
          <Button
            className='collapseBtn'
            type='text'
            icon={
              menuCollapsed ? (
                <Icon icon='ri:menu-unfold-fill' />
              ) : (
                <Icon icon='ri:menu-fold-fill' />
              )
            }
            onClick={toggleCollapsed}
          />
          {isExpandedMobile ? null : (
            <>
              <MessagesPagination />
              <ModelSelector />
            </>
          )}
        </Header>
        <Content>{isExpandedMobile ? null : children}</Content>
      </AntLayout>
    </AntLayout>
  );
}
