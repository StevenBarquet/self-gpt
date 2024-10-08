// ---Dependencies
import React from 'react';
// ---Styles
import style from './GptFooter.module.scss';
import { swalApiConfirm } from 'src/utils/functions/alertUtils';
import { Button } from 'antd';
import { Icon } from '@iconify/react';
import { usePanelActions } from '../../usePanelActions';
import { useSupabase } from 'src/utils/app/useSupabase';

interface Props {
  selectedIds: string[];
}

/**
 * GptFooter Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function GptFooter({ selectedIds }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { onCreateGpt } = usePanelActions();
  const { batchDeleteGpt } = useSupabase();
  // -----------------------MAIN METHODS
  const onDelete = () => {
    swalApiConfirm({
      callback: async () => {
        await batchDeleteGpt(selectedIds);
      },
      successMsg: 'Selection deleted successfully',
    });
  };
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['GptFooter']}>
      <Button block type='text' icon={<Icon icon='gridicons:create' />} onClick={onCreateGpt}>
        Create
      </Button>
      <Button
        block
        danger
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
