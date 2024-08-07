// ---Dependencies
import { Button, Input } from 'antd';
import React, { KeyboardEvent } from 'react';
import { type useInput } from 'src/utils/hooks/useInput';

interface Props extends ReturnType<typeof useInput> {
  disable?: boolean;
  ondAsk: () => void;
}

/**
 * ChatInput Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function ChatInput({ onChange, value, disable, ondAsk }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  // -----------------------MAIN METHODS
  async function onKeyPress(event: KeyboardEvent<unknown>) {
    if (event.key === 'Enter' && event.shiftKey) {
      await ondAsk();
    }
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className='ChatInput'>
      <Input.TextArea
        onKeyPress={onKeyPress}
        onChange={onChange as any}
        value={value}
        disabled={disable}
      />
      <Button onClick={ondAsk} type='primary' disabled={disable}>
        Send
        <br />
        (Shift + Enter)
      </Button>
    </div>
  );
}
