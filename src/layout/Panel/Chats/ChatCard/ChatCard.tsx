// ---Dependencies
import React, { useState } from 'react';
// ---Styles
import style from './ChatCard.module.scss';
import { WithId } from 'src/utils/functions/typesUtils';
import { Conversation } from 'src/database/Conversations/definitions';
import { Button, Tooltip } from 'antd';
import { DynamicIcon } from 'src/common/DynamicIcon/DynamicIcon';
import { Icon } from '@iconify/react';
import { GPT } from 'src/database/GPTs/definitions';

interface Props extends WithId<Conversation> {
  onClickConversation: (id: string) => void;
  isActive: boolean;
  onGetGpt: (id: string) => WithId<GPT> | undefined;
}

/**
 * ChatCard Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ChatCard({ name, onClickConversation, isActive, id, onGetGpt, gpt_base }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const gpt = onGetGpt(gpt_base!);
  const [visible, setVisible] = useState(false);
  // -----------------------MAIN METHODS
  const showTooltip = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 5000); // Oculta el tooltip después de 8 segundos
  };
  function onClick() {
    onClickConversation(id);
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!gpt) return null; // No debería existir una conversación sin gpt de referencia
  return (
    <div className={style['ChatCard']}>
      <Tooltip title={name}>
        <Button
          onClick={onClick}
          type='text'
          className={`chatBtn ${isActive ? 'chatBtn-active' : ''}`}
        >
          <DynamicIcon icon={gpt.icon} />
          <section>
            <p>{name}</p>
          </section>
        </Button>
      </Tooltip>
      <div className='options'>
        <Button danger type='text'>
          <Icon icon='bi:trash-fill' />
        </Button>
        <Tooltip title={name} visible={visible}>
          <Button onClick={showTooltip} type='text'>
            <Icon icon='memory:tooltip-above-help' />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
