// ---Dependencies
import React from 'react';
// ---Styles
import style from './UpdatePanel.module.scss';
import { Button, Switch } from 'antd';
import { CopyButton } from 'src/common/CopyButton/CopyButton';
import { Message } from 'src/database/Messages/definitions';
import { WithId } from 'src/utils/functions/typesUtils';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
import { Icon } from '@iconify/react';

interface Props {
  message: WithId<Message>;
  reloadChatMsgs: () => void;
}

/**
 * UpdatePanel Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function UpdatePanel(props: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { contextCtlr, onDelete } = usePanelCtlr(props);
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['UpdatePanel']}>
      <div className='check'>
        In Context: <Switch checked={contextCtlr.cheked} onClick={contextCtlr.toggle} />
      </div>
      <CopyButton toCopy={props.message.content} />
      <Button onClick={onDelete} danger type='text'>
        <Icon icon='bi:trash-fill' />
      </Button>
    </div>
  );
}

function usePanelCtlr({ message, reloadChatMsgs }: Props) {
  const { toggleContext, deleteMessage } = useSupabase();
  const cheked = message.context;
  const toggle = () =>
    toggleContext(message).then(() => {
      reloadChatMsgs();
      swalApiSuccessAuto('Context updated');
    });

  const onDelete = () => {
    swalApiConfirm({
      callback: () => deleteMessage(message.id, reloadChatMsgs),
    });
  };

  return {
    contextCtlr: {
      cheked,
      toggle,
    },
    onDelete,
  };
}
