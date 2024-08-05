// ---Dependencies
import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
// ---Styles
import style from './Panel.module.scss';
import { Icon } from '@iconify/react';
import { useSupabase } from 'src/utils/app/useSupabase';
import { useAppLogicStore } from 'src/store/appLogic';
import { Spinner } from 'src/common/Spinner/Spinner';

/**
 * Panel Component:  Descripción del comportamiento...
 */
export function Panel() {
  // -----------------------CONSTS, HOOKS, STATES
  const { getGPts, getConversations, isLoading } = useSupabase();
  const { update, GPTs } = useAppLogicStore();
  useEffect(() => initialPopulate(), []);

  const items: TabsProps['items'] = [
    {
      key: 'gpts',
      label: (
        <div className='tabTitle'>
          GPTs <Icon icon='carbon:area-custom' />
        </div>
      ),
      children: isLoading ? <Spinner /> : 'Contenido cargado',
    },
    {
      key: 'chats',
      label: (
        <div className='tabTitle'>
          Chats <Icon icon='heroicons-outline:chat' />
        </div>
      ),
      children: isLoading ? <Spinner /> : 'Content of Tab Pane 2',
    },
  ];
  // -----------------------MAIN METHODS
  const onChange = (key: string) => {
    if (key === 'gpts') handleGpts();
    else handleConversations();
  };

  function initialPopulate() {
    if (!GPTs.length) {
      handleGpts();
      handleConversations();
    }
  }
  // -----------------------AUX METHODS
  async function handleGpts() {
    const data = await getGPts();
    if (data) update({ GPTs: data });
  }
  async function handleConversations() {
    const data = await getConversations();
    if (data) update({ Conversations: data });
  }
  // -----------------------RENDER
  return (
    <div className={style['Panel']}>
      <Tabs items={items} onChange={onChange} centered />
    </div>
  );
}
