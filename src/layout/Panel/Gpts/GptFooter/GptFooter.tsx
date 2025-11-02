// ---Dependencies
import React from 'react';
// ---Styles
import style from './GptFooter.module.scss';
import { Button } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  onCreateGpt: () => void;
  onBatchDeleteGpt: () => void;
  selectedIds: string[];
}

/**
 * GptFooter Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function GptFooter({ selectedIds, onCreateGpt, onBatchDeleteGpt }: Props) {
  // -----------------------CONSTS, HOOKS, STATES

  // -----------------------MAIN METHODS

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
        onClick={onBatchDeleteGpt}
      >
        Delete: {selectedIds.length}
      </Button>
    </div>
  );
}
