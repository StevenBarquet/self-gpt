// ---Dependencies
import React from 'react';
// ---Styles
import style from './SingleValidate.module.scss';
import { useBoolean } from 'src/utils/hooks/useBoolean';
import { useInput } from 'src/utils/hooks/useInput';
import { LabelGridInput } from 'src/common/Formctlr/LabelGridInput/LabelGridInput';
import { Button, Input } from 'antd';
import { Icon } from '@iconify/react';

interface Props {
  isValid: boolean;
  onValidate: (a: string) => Promise<void>;
  label: string;
}

/**
 * SingleValidate Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function SingleValidate({ isValid, onValidate, label }: Props) {
  // -----------------------CONSTS, HOOKS, STATES
  const { value: isLoading, setTrue: setLoadTrue, setFalse: setLoadFalse } = useBoolean();
  const { value: touched, setTrue: setToachedTrue } = useBoolean();
  const { value, onChange } = useInput();
  const isError = touched && !value.length;
  const fieldsNotEmpty = !!value.length;

  // -----------------------MAIN METHODS
  function onSubmit() {
    setToachedTrue();
    setLoadTrue();
    onValidate(value).finally(() => setLoadFalse());
  }
  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return (
    <div className={style['SingleValidate']}>
      <LabelGridInput label={label}>
        <Input
          value={value}
          onChange={onChange}
          status={isError ? 'error' : undefined}
          disabled={isValid}
        />
        {isError ? <div className='customHelper'>Campo requerido</div> : null}
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
