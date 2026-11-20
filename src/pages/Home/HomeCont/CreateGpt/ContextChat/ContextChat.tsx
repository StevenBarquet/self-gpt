// ---Dependencies
import { Icon } from '@iconify/react';
import type { FormikProps } from 'formik';
import type { ReactElement } from 'react';
// ---UI Dependencies
import { Button } from 'antd';
// ---Components
import { FBasicSelect } from 'src/common/Formctlr/Formik/FBasicSelect/FBasicSelect';
import { FBasicTextArea } from 'src/common/Formctlr/Formik/FBasicTextArea/FBasicTextArea';
// ---Config
import type { ICreateGptValues } from '../useCreateGptForm';
import { CONTEXT_CHAT_ROLES } from '../validations';
// ---Styles
import style from './ContextChat.module.scss';

interface Props {
  formik: FormikProps<ICreateGptValues>;
  onAddMessage: () => void;
  onDeleteMessage: (index: number) => void;
  onClearMessages: () => void;
}

const ROLE_OPTIONS = CONTEXT_CHAT_ROLES.map((role) => ({
  value: role,
  label: role.charAt(0).toUpperCase() + role.slice(1),
}));

const PLACEHOLDERS: Record<string, string> = {
  system: 'Instructions and rules your GPT must follow',
  user: 'What the user says',
  assistant: 'How your GPT answers',
};

/**
 * ContextChat Component: Edits the GPT context as a list of chat messages (role + content)
 * @param {Props} props - formik instance and the message list actions from useCreateGptForm
 */
export function ContextChat({
  formik,
  onAddMessage,
  onDeleteMessage,
  onClearMessages,
}: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const messages = formik.values.contextMessages;
  const listError = formik.errors.contextMessages;
  const hasContent = messages.some((msg) => msg.content.trim());
  const canClear = hasContent || messages.length > 1;
  // -----------------------RENDER
  return (
    <div className={style['ContextChat']}>
      {messages.map((msg, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: messages have no stable id and every field is formik-controlled
        <section key={i} className='message'>
          <header>
            <div className='role'>
              <FBasicSelect
                formik={formik}
                valueName={`contextMessages.${i}.role`}
                placeholder='Role'
                options={ROLE_OPTIONS}
              />
            </div>
            <Button
              danger
              type='text'
              aria-label={`Delete message #${i + 1}`}
              icon={<Icon icon='mdi:trash-can-outline' />}
              onClick={() => onDeleteMessage(i)}
              disabled={i === 0}
            />
          </header>
          <FBasicTextArea
            formik={formik}
            valueName={`contextMessages.${i}.content`}
            placeholder={PLACEHOLDERS[msg.role] ?? 'Message content'}
            autoSize={{ minRows: 2, maxRows: 12 }}
          />
        </section>
      ))}

      {typeof listError === 'string' ? (
        <div className='ant-form-item-explain-error list-error'>{listError}</div>
      ) : null}

      <footer>
        <Button icon={<Icon icon='mdi:plus' />} onClick={onAddMessage}>
          Add message
        </Button>
        <Button
          danger
          disabled={!canClear}
          icon={<Icon icon='mdi:delete-sweep-outline' />}
          onClick={onClearMessages}
        >
          Clear all
        </Button>
      </footer>
    </div>
  );
}
