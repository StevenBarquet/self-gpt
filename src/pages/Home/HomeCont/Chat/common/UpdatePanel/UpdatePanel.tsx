// ---Dependencies
import { Icon } from '@iconify/react';
import { Button, Switch } from 'antd';
import type { ReactElement } from 'react';
import { CopyButton } from 'src/common/CopyButton/CopyButton';
import type { Message } from 'src/database/Messages/definitions';
import { useSupabase } from 'src/utils/app/useSupabase';
import { swalApiConfirm, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
import type { WithId } from 'src/utils/functions/typesUtils';
// ---Styles
import style from './UpdatePanel.module.scss';

interface Props {
  message: WithId<Message>;
  borderles?: boolean;
  reloadChatMsgs: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function UpdatePanel(props: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { contextCtlr, onDelete } = usePanelCtlr(props);
  // -----------------------MAIN METHODS
  const borderStyles = props.borderles ? { border: 'none', boxShadow: 'none' } : {};
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style.UpdatePanel} style={borderStyles}>
      <div className="check">
        In Context: <Switch checked={contextCtlr.cheked} onClick={contextCtlr.toggle} />
      </div>
      {props.onToggleExpand && (
        <Button onClick={props.onToggleExpand} type="text">
          <Icon icon={props.expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
        </Button>
      )}
      <CopyButton toCopy={props.message.content} />
      <Button onClick={onDelete} danger type="text">
        <Icon icon="bi:trash-fill" />
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
