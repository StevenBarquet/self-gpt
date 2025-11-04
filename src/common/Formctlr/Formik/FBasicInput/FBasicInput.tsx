// ---Dependencies

// ---UI Dependencies
import { Input } from 'antd';
// ---Custom Hooks
import type { FormikProps } from 'formik';
import type { KeyboardEvent, ReactElement } from 'react';
import { Frow, type FrowProps } from 'react-forge-grid';
import style from './FBasicInput.module.scss';

interface Props<T> {
  label?: string;
  placeholder?: string;
  formik: FormikProps<T>;
  valueName: keyof T;
  required?: boolean;
  submitOnEnter?: boolean;
  disabled?: boolean;
  containerProps?: Omit<FrowProps, 'children'>;
}

/**
 * FBasicInput Component: Permite crear un "TextInput" dentro de un formulario de formik de una manera sencilla.
 * @param {Props} props - Parámetros del componente
 * @returns {ReactElement}
 */
export function FBasicInput<T>(props: Props<T>): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const {
    disabled,
    label,
    formik,
    valueName,
    required,
    submitOnEnter,
    placeholder,
    containerProps,
  } = props;

  const safeValueName = String(valueName || '');
  const safeValue = String(formik.values[valueName] || '');

  const errMessage = formik.errors[valueName];
  const isError = !!errMessage && !!formik.touched[valueName];

  const newRowProps: FrowProps = {
    vAlign: 'top',
    hAlign: 'start',
    ...containerProps,
  };

  const newLabel = required && label ? `*${label}` : label;

  // -----------------------MAIN METHODS
  /** Función para hacer submit al presionar enter */
  async function onKeyPress(event: KeyboardEvent<unknown>) {
    if (submitOnEnter && event.key === 'Enter') {
      await formik.submitForm();
    }
  }
  // -----------------------RENDER
  return (
    <Frow
      {...newRowProps}
      className={newRowProps?.className || ` ${style['FBasicInput']}`}
      style={{ marginTop: '10px' }}
    >
      {label?.length ? <label htmlFor={`form-input${safeValueName}`}>{newLabel}</label> : null}
      <Input
        name={`form-input${safeValueName}`}
        id={`form-input${safeValueName}`}
        disabled={disabled}
        value={safeValue}
        onChange={formik.handleChange(valueName)}
        onKeyPress={onKeyPress}
        status={isError ? 'error' : undefined}
        placeholder={placeholder}
      />
      {isError ? <div className='customHelper'>{String(errMessage)}</div> : null}
    </Frow>
  );
}
