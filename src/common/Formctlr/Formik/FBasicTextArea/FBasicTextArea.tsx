// ---Dependencies

// ---UI Dependencies
import { Input } from 'antd';
// ---Custom Hooks
import type { FormikProps } from 'formik';
import type { CSSProperties, ReactElement } from 'react';
import { Frow, type FrowProps } from 'react-forge-grid';
import style from './FBasicTextArea.module.scss';

const { TextArea } = Input;

interface Props<T> {
  label?: string;
  placeholder?: string;
  formik: FormikProps<T>;
  valueName: keyof T;
  required?: boolean;
  disabled?: boolean;
  inputStyle?: CSSProperties;
  containerProps?: Omit<FrowProps, 'children'>;
}

/**
 * FBasicTextArea Component: Permite crear un "TextArea" dentro de un formulario de formik de una manera sencilla.
 * @param {Props} props - Parámetros del componente
 * @returns {ReactElement}
 */
export function FBasicTextArea<T>(props: Props<T>): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { disabled, formik, valueName, label, placeholder, required, containerProps, inputStyle } =
    props;

  const errMessage = formik.errors[valueName];
  const isError = !!errMessage && !!formik.touched[valueName];

  const safeValueName = String(valueName || '');
  const safeValue = String(formik.values[valueName] || '');

  const newRowProps: FrowProps = {
    vAlign: 'top',
    hAlign: 'start',
    ...containerProps,
  };

  const newLabel = required && label ? `*${label}` : label;

  // -----------------------RENDER
  return (
    <Frow
      {...newRowProps}
      className={newRowProps?.className || ` ${style['FBasicTextArea']}`}
      style={{ marginTop: '10px' }}
    >
      {label?.length ? <label htmlFor={`form-input${safeValueName}`}>{newLabel}</label> : null}

      <TextArea
        name={`form-input${safeValueName}`}
        id={`form-input${safeValueName}`}
        disabled={disabled}
        value={safeValue}
        onChange={formik.handleChange(valueName)}
        status={isError ? 'error' : undefined}
        placeholder={placeholder}
        style={inputStyle}
      />
      {isError ? (
        <div className='ant-form-item-explain-error customHelper'>{String(errMessage)}</div>
      ) : null}
    </Frow>
  );
}
