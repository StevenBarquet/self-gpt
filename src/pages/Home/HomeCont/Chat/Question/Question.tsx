// ---Dependencies
import React from 'react';
// ---Styles
import style from './Question.module.scss';
import { UpdatePanel } from '../common/UpdatePanel/UpdatePanel';
import { Message } from 'src/database/Messages/definitions';
import { WithId } from 'src/utils/functions/typesUtils';

interface Props {
  message: WithId<Message>;
  reloadChatMsgs: () => void;
}

/**
 * Question Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function Question({ message, reloadChatMsgs }: Props) {
  // -----------------------CONSTS, HOOKS, STATES

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (!message) return null;
  return (
    <div className={style['Question']}>
      <section>{message.content}</section>
      <UpdatePanel reloadChatMsgs={reloadChatMsgs} message={message} />
    </div>
  );
}
