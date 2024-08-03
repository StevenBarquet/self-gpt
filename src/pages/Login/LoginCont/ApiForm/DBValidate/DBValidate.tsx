// ---Dependencies
import React from 'react';
// ---Styles
import style from './DBValidate.module.scss';
import { LabelGridInput } from 'src/common/Formctlr/LabelGridInput/LabelGridInput';
import { Button, Input } from 'antd';
import { Icon } from '@iconify/react';
import { useBoolean } from 'src/utils/hooks/useBoolean';
import { useInput } from 'src/utils/hooks/useInput';

interface Props {
  isValid: boolean;
  onValidate: (url: string, key: string) => Promise<void>;
}

/**
 * DBValidate Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function DBValidate({ isValid, onValidate }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { value: isLoading, setTrue: setLoadTrue, setFalse: setLoadFalse } = useBoolean();
  const { value: touched, setTrue: setToachedTrue } = useBoolean();
  const { value: url, onChange: onUrlChange } = useInput();
  const { value: key, onChange: onKeyChange } = useInput();
  const isUrlError = touched && !url.length;
  const isKeyError = touched && !key.length;
  const fieldsNotEmpty = !!url.length && !!key.length;

  // -----------------------MAIN METHODS
  function onSubmit() {
    setToachedTrue();
    setLoadTrue();
    onValidate(url, key).finally(() => setLoadFalse());
  }
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['DBValidate']}>
      <LabelGridInput label='SUPABASE_URL'>
        <Input
          value={url}
          onChange={onUrlChange}
          status={isUrlError ? 'error' : undefined}
          disabled={isValid}
        />
        {isUrlError ? <div className='customHelper'>Campo requerido</div> : null}
      </LabelGridInput>
      <LabelGridInput label='SUPABASE_KEY'>
        <Input
          value={key}
          onChange={onKeyChange}
          status={isKeyError ? 'error' : undefined}
          disabled={isValid}
        />
        {isKeyError ? <div className='customHelper'>Campo requerido</div> : null}
      </LabelGridInput>
      <Button
        type='primary'
        block
        icon={isLoading ? <Icon icon={'eos-icons:loading'} /> : undefined}
        disabled={!fieldsNotEmpty || isValid}
        onClick={onSubmit}
      >
        {isValid ? <Icon icon={'codicon:check-all'} /> : null}
        Validate
      </Button>
    </div>
  );
}
