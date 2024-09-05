// ---Dependencies
import React from 'react';
// ---Styles
import style from './ChatFooter.module.scss';
import { Button } from 'antd';
import { Icon } from '@iconify/react';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm } from 'src/utils/functions/alertUtils';

interface Props {
  selectedIds: string[];
}

/**
 * ChatFooter Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ChatFooter({ selectedIds }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { batchDeleteConversations } = useSupabase();
  // -----------------------MAIN METHODS
  const onDelete = () => {
    swalApiConfirm({
      callback: async () => {
        await batchDeleteConversations(selectedIds);
      },
      successMsg: 'Selection deleted successfully',
    });
  };
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['ChatFooter']}>
      <Button
        block
        disabled={!selectedIds.length}
        type='text'
        icon={<Icon icon='ic:baseline-delete-sweep' />}
        onClick={onDelete}
      >
        Delete: {selectedIds.length}
      </Button>
    </div>
  );
}
