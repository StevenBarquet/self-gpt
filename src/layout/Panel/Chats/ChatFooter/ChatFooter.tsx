// ---Dependencies
import React from 'react';
// ---Styles
import style from './ChatFooter.module.scss';
import { Button } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  selectedIds: string[];
  onBatchDelete: () => void;
}

/**
 * ChatFooter Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ChatFooter({ selectedIds, onBatchDelete }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['ChatFooter']}>
      <Button
        block
        disabled={!selectedIds.length}
        type='text'
        icon={<Icon icon='ic:baseline-delete-sweep' />}
        onClick={onBatchDelete}
      >
        Delete: {selectedIds.length}
      </Button>
    </div>
  );
}
