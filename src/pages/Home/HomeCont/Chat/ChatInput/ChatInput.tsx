// ---Dependencies
import { Button, Switch } from 'antd';
import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { useInput } from 'src/utils/hooks/useInput';
import style from './ChatInput.module.scss';
import { Icon } from '@iconify/react';

import { useAppInfoStore } from 'src/store/appInfo';
import { Spinner } from 'src/common/Spinner/Spinner';

interface Props extends ReturnType<typeof useInput> {
  chatLoading?: boolean;
  sdkLoading?: boolean;
  stopGeneration: () => void;
  ondAsk: () => void;
  ctxCtlr: {
    value: boolean;
    lastCtxCheck: boolean | undefined;
    toggle: () => void;
  };
}

/**
 * ChatInput Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ChatInput({
  onChange,
  value,
  chatLoading,
  sdkLoading,
  stopGeneration,
  ondAsk,
  ctxCtlr,
}: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isMobile, menuCollapsed } = useAppInfoStore();
  const leftPanelWidth = menuCollapsed ? (isMobile ? 20 : 80) : isMobile ? 0 : 470;
  const rightMargin = isMobile ? '- 20px' : '- 70px';
  const containerWidth = `calc(100vw - ${leftPanelWidth}px ${rightMargin})`;
  const fullIsLoading = chatLoading || sdkLoading;

  // -----------------------MAIN METHODS
  async function onKeyPress(event: KeyboardEvent<unknown>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      ondAsk();
    }
  }
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Redefine la altura antes de ajustar
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['ChatInput']} style={{ width: containerWidth }}>
      {!!value?.length && (
        <Button
          className='sendBtn'
          onClick={sdkLoading ? stopGeneration : ondAsk}
          type='primary'
          size='large'
        >
          {sdkLoading ? <Icon icon='si:stop-fill' /> : <Icon icon='mingcute:arrow-up-fill' />}
        </Button>
      )}
      {fullIsLoading ? (
        <div className='spinnerContainer'>
          <Spinner displayMessage={''} />
        </div>
      ) : (
        <textarea
          className={`textarea`}
          ref={textareaRef}
          value={value}
          onChange={onChange as any}
          placeholder='Ask me anything...'
          onKeyDown={onKeyPress}
          rows={1}
          style={{
            maxHeight: '45vh', // Limitar la altura máxima
            overflow: 'auto', // Permitir el desplazamiento
            // resize: 'none',    // Evitar que el usuario cambie el tamaño manualmente
          }}
        />
      )}

      <div className='keepInContext'>
        <label htmlFor='keepInContext'>Context</label>
        <Switch
          id='keepInContext'
          defaultChecked={ctxCtlr.lastCtxCheck}
          checked={ctxCtlr.value}
          onClick={ctxCtlr.toggle}
        />
      </div>
    </div>
  );
}
