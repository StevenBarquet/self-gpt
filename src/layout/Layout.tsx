// ---Dependencies

import { Icon } from '@iconify/react';
import { Layout as AntLayout, Button } from 'antd';
import { createContext, type RefObject, useRef, type ReactNode } from 'react';
import { AntdProvDark } from 'src/providers/AntdProvDark/AntdProv';
import { useAppInfoStore } from 'src/store/appInfo';
import style from './Layout.module.scss';
import { MessagesPagination } from './MessagesPagination/MessagesPagination';
import { ModelSelector } from './ModelSelector/ModelSelector';
import { Panel } from './Panel/Panel';

const { Header, Sider, Content } = AntLayout;

type ContainerRef = RefObject<HTMLDivElement | null>;

export const LayoutRefProvider = createContext<{
  contentRef: ContainerRef;
}>({
  contentRef: {} as unknown as ContainerRef,
});

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
  const contentRef = useRef<HTMLDivElement>(null);

  const leftPanelWidth = menuCollapsed ? (isMobile ? '20px' : '80px') : isMobile ? '82vw' : '470px';
  // const rightMargin = isMobile ? '- 20px' : '- 70px';
  const headerWidth = `calc(100vw - ${leftPanelWidth})`;
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <LayoutRefProvider.Provider value={{ contentRef }}>
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
            <div className='headerContainer' style={{ width: headerWidth, left: leftPanelWidth }}>
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
            </div>
          </Header>
          <Content ref={contentRef}>{isExpandedMobile ? null : children}</Content>
        </AntLayout>
      </AntLayout>
    </LayoutRefProvider.Provider>
  );
}
