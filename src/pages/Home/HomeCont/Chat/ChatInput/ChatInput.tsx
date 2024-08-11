// ---Dependencies
import { Button, Input } from 'antd';
import React, { KeyboardEvent } from 'react';
import { Fcol, Frow } from 'react-forge-grid';
import { basicResponsive } from 'src/utils/functions/responsiveUtils';
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
    if (event.key === 'Enter' && !event.shiftKey) {
      await ondAsk();
    }
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <Frow hSpace={5} className='ChatInput'>
      <Fcol {...basicResponsive(80)}>
        <Input.TextArea
          onKeyPress={onKeyPress}
          onChange={onChange as any}
          value={value}
          disabled={disable}
        />
      </Fcol>
      <Fcol {...basicResponsive(20)}>
        <Button
          onClick={ondAsk}
          style={{ height: 53 }}
          type='primary'
          disabled={disable || !value.length}
          block
        >
          Send
          <br />
          (Shift + Enter)
        </Button>
      </Fcol>
    </Frow>
  );
}
