import { Select } from 'antd';
import type { FormikProps } from 'formik';
import type { ReactElement } from 'react';
import { Frow, type FrowProps } from 'react-forge-grid';
import style from './FBasicSelect.module.scss';

interface Props<T> {
  label?: string;
  formik: FormikProps<T>;
  valueName: keyof T;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  containerProps?: Omit<FrowProps, 'children'>;
  options: Array<{ value: string; label: string }>;
}

/**
 * FBasicSelect Component: Permite crear un "Select" dentro de un formulario de formik de una manera sencilla.
 * @param {Props} props - Parámetros del componente
 * @returns {ReactElement}
 */
export function FBasicSelect<T>(props: Props<T>): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const { placeholder, disabled, label, formik, valueName, required, containerProps, options } =
    props;

  const safeValueName = String(valueName || '');
  const safeValue = formik.values[valueName] as string | undefined;

  const errMessage = formik.errors[valueName];
  const isError = !!errMessage && (!!formik.touched[valueName] || formik.submitCount > 0);

  const newRowProps: FrowProps = {
    vAlign: 'top',
    hAlign: 'start',
    ...containerProps,
  };

  const newLabel = required && label ? `*${label}` : label;

  // -----------------------MAIN METHODS
  const handleChange = (value: string) => {
    formik.setFieldValue(safeValueName, value);
  };

  // -----------------------RENDER
  return (
    <Frow
      {...newRowProps}
      className={newRowProps?.className || ` ${style['FBasicSelect']}`}
      style={{ marginTop: '10px' }}
    >
      {label?.length ? <label htmlFor={`form-input${safeValueName}`}>{newLabel}</label> : null}
      <Select
        id={`form-input${safeValueName}`}
        disabled={disabled}
        value={safeValue}
        onChange={handleChange}
        placeholder={placeholder}
        options={options}
        style={{ width: '100%' }}
      />

      {isError ? (
        <div style={{ paddingLeft: 15 }} className='customHelper'>
          {String(errMessage)}
        </div>
      ) : null}
    </Frow>
  );
}
