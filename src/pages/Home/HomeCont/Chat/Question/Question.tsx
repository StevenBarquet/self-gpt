// ---Dependencies
import { Icon } from '@iconify/react';
import { Button } from 'antd';
import { useState, type ReactElement } from 'react';
import type { Message } from 'src/database/Messages/definitions';
import type { WithId } from 'src/utils/functions/typesUtils';
// ---Components
import { UpdatePanel } from '../common/UpdatePanel/UpdatePanel';
// ---Styles
import style from './Question.module.scss';

interface Props {
  message: WithId<Message>;
  reloadChatMsgs: () => void;
  onEdit: (message: WithId<Message>) => void;
}

export function Question({ message, reloadChatMsgs, onEdit }: Props): ReactElement | null {
  // -----------------------CONSTS, HOOKS, STATES
  const [expanded, setExpanded] = useState(false);

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!message) return null;
  return (
    <div className={style.Question}>
      <section className={expanded ? 'expanded' : ''}>
        {message.content}
      </section>
      <UpdatePanel
        reloadChatMsgs={reloadChatMsgs}
        message={message}
        expanded={expanded}
        onToggleExpand={() => setExpanded((v) => !v)}
      >
        <Button onClick={() => onEdit(message)} type="text">
          <Icon icon="mdi:pencil" />
        </Button>
      </UpdatePanel>
    </div>
  );
}
