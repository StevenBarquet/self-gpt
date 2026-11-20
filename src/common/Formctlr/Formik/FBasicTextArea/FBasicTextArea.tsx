// ---Dependencies

// ---UI Dependencies
import { Input } from 'antd';
import type { TextAreaProps } from 'antd/es/input';
// ---Custom Hooks
import { type FormikProps, getIn } from 'formik';
import type { CSSProperties, ReactElement } from 'react';
import { Frow, type FrowProps } from 'react-forge-grid';
import type { FormikFieldName } from '../formikTypes';
import style from './FBasicTextArea.module.scss';

const { TextArea } = Input;

interface Props<T> {
  label?: string;
  placeholder?: string;
  formik: FormikProps<T>;
  valueName: FormikFieldName<T>;
  required?: boolean;
  disabled?: boolean;
  inputStyle?: CSSProperties;
  autoSize?: TextAreaProps['autoSize'];
  containerProps?: Omit<FrowProps, 'children'>;
}

/**
 * FBasicTextArea Component: Permite crear un "TextArea" dentro de un formulario de formik de una manera sencilla.
 * @param {Props} props - Parámetros del componente
 * @returns {ReactElement}
 */
export function FBasicTextArea<T>(props: Props<T>): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const {
    disabled,
    formik,
    valueName,
    label,
    placeholder,
    required,
    containerProps,
    inputStyle,
    autoSize,
  } = props;

  const safeValueName = String(valueName || '');
  const safeValue = String(getIn(formik.values, safeValueName) || '');

  const errMessage = getIn(formik.errors, safeValueName);
  const isError = !!errMessage && !!getIn(formik.touched, safeValueName);

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
        onChange={formik.handleChange(safeValueName)}
        status={isError ? 'error' : undefined}
        placeholder={placeholder}
        style={inputStyle}
        autoSize={autoSize}
      />
      {isError ? (
        <div className='ant-form-item-explain-error customHelper'>{String(errMessage)}</div>
      ) : null}
    </Frow>
  );
}
