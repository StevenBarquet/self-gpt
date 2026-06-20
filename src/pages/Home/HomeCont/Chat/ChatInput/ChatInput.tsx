// ---Dependencies
import { Button, Switch } from 'antd';
import type { KeyboardEvent, ReactElement, RefObject } from 'react';
import type { Message } from 'src/database/Messages/definitions';
import type { useInput } from 'src/utils/hooks/useInput';
import type { WithId } from 'src/utils/functions/typesUtils';
// ---Components
import { Icon } from '@iconify/react';
import { Spinner } from 'src/common/Spinner/Spinner';
// ---Config
import { useAppInfoStore } from 'src/store/appInfo';
// ---Styles
import style from './ChatInput.module.scss';

interface Props extends ReturnType<typeof useInput> {
  chatLoading?: boolean;
  sdkLoading?: boolean;
  stopGeneration: () => void;
  ondAsk: () => void;
  cancelEdit: () => void;
  editingMessageRef: RefObject<WithId<Message> | null>;
  ctxCtlr: {
    value: boolean;
    lastCtxCheck: boolean | undefined;
    toggle: () => void;
  };
}

export function ChatInput({
  onChange,
  value,
  chatLoading,
  sdkLoading,
  stopGeneration,
  ondAsk,
  cancelEdit,
  editingMessageRef,
  ctxCtlr,
}: Props): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { isMobile, menuCollapsed } = useAppInfoStore();
  const fullIsLoading = chatLoading || sdkLoading;
  const isEditing = !!editingMessageRef.current;
  const panelWidth = menuCollapsed ? (isMobile ? 20 : 80) : isMobile ? 0 : 470;

  // -----------------------MAIN METHODS
  function onKeyPress(event: KeyboardEvent<unknown>) {
    if (isMobile) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      ondAsk();
    }
  }

  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style.ChatInput} style={{ left: panelWidth + 35 }}>
      {!!value?.length && (
        <Button
          className="sendBtn"
          onClick={sdkLoading ? stopGeneration : ondAsk}
          type="primary"
          size="large"
        >
          {sdkLoading ? <Icon icon="si:stop-fill" /> : <Icon icon="mingcute:arrow-up-fill" />}
        </Button>
      )}
      {fullIsLoading ? (
        <div className="spinnerContainer">
          <Spinner displayMessage={''} />
        </div>
      ) : (
        <textarea
          className="textarea"
          value={value}
          onChange={onChange as any}
          placeholder="Ask me anything..."
          onKeyDown={onKeyPress}
          rows={1}
        />
      )}

      {isEditing && (
        <div className="editingIndicator">
          <Icon icon="mdi:pencil" />
          <span>Editing</span>
          <Button type="text" size="small" onClick={cancelEdit}>
            <Icon icon="mdi:close" />
          </Button>
        </div>
      )}

      <div className="keepInContext">
        <label htmlFor="keepInContext">Context</label>
        <Switch
          id="keepInContext"
          defaultChecked={ctxCtlr.lastCtxCheck}
          checked={ctxCtlr.value}
          onClick={ctxCtlr.toggle}
        />
      </div>
    </div>
  );
}
