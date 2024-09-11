// ---Dependencies
import { type KeyboardEvent, type ReactElement } from 'react';
// ---UI Dependencies
import { InputNumber } from 'antd';
import { Fcol, Frow, type GridSystem, type FrowProps } from 'react-forge-grid';
// ---Custom Hooks
import { type FormikProps } from 'formik';
import { useAppInfoStore } from 'src/store/appInfo';

interface Props<T> {
  label?: string;
  placeholder?: string;
  formik: FormikProps<T>;
  valueName: keyof T;
  labelGrid?: GridSystem;
  inputGrid?: GridSystem;
  required?: boolean;
  submitOnEnter?: boolean;
  disabled?: boolean;
  containerProps?: Omit<FrowProps, 'children'>;
}

/**
 * FBasicNumber Component: Permite crear un "TextInput" dentro de un formulario de formik de una manera sencilla.
 * @param {Props} props - Parámetros del componente
 * @returns {ReactElement}
 */
export function FBasicNumber<T>(props: Props<T>): ReactElement {
  // -----------------------CONSTS, HOOKS, STATES
  const {
    disabled,
    label,
    formik,
    valueName,
    labelGrid,
    inputGrid,
    required,
    submitOnEnter,
    placeholder,
    containerProps,
  } = props;

  const { isMobile } = useAppInfoStore();

  const errMessage = formik.errors[valueName];
  const isError = !!errMessage && !!formik.touched[valueName];

  const newRowProps: FrowProps = {
    vAlign: 'top',
    hAlign: 'start',
    ...containerProps,
  };
  const newLabelGrid: GridSystem = {
    span: 25,
    ...labelGrid,
  };
  const newInputGrid: GridSystem = {
    span: label ? 70 : 100,
    ...inputGrid,
  };
  const newLabel = required && label ? `*${label}` : label;

  const currentStyle =
    newLabelGrid.span === 100 || (isMobile && (newLabelGrid.xs === 100 || newLabelGrid.sm === 100))
      ? { textAlign: 'start', padding: '5px 0px' }
      : { textAlign: 'end', padding: '5px 10px' };

  // -----------------------MAIN METHODS
  /** Función para hacer submit al presionar enter */
  async function onKeyPress(event: KeyboardEvent<unknown>) {
    if (submitOnEnter && event.key === 'Enter') {
      await formik.submitForm();
    }
  }
  const onChange = (value: number | null) => {
    formik.setFieldValue(valueName as string, value);
  };
  // -----------------------RENDER
  return (
    <Frow {...newRowProps} style={{ marginTop: '10px' }}>
      {label?.length ? (
        <Fcol {...newLabelGrid} style={currentStyle}>
          <span>{newLabel}:</span>
        </Fcol>
      ) : null}

      <Fcol {...newInputGrid}>
        <InputNumber
          style={{ width: '100%' }}
          disabled={disabled}
          value={Number(formik.values[valueName] || '')}
          onChange={onChange}
          onKeyPress={onKeyPress}
          status={isError ? 'error' : undefined}
          placeholder={placeholder}
        />

        {isError ? <div className='customHelper'>{String(errMessage)}</div> : null}
      </Fcol>
    </Frow>
  );
}
