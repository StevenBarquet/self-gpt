import { Select } from 'antd';
import { FormikProps } from 'formik';
import { ReactElement } from 'react';
import { Frow, Fcol, FrowProps, GridSystem } from 'react-forge-grid';
import { useAppInfoStore } from 'src/store/appInfo';

interface Props<T> {
  label?: string;
  formik: FormikProps<T>;
  valueName: keyof T;
  labelGrid?: GridSystem;
  inputGrid?: GridSystem;
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
  const {
    placeholder,
    disabled,
    label,
    formik,
    valueName,
    labelGrid,
    inputGrid,
    containerProps,
    options,
  } = props;

  const { isMobile } = useAppInfoStore();

  const safeValueName = String(valueName);
  const errMessage = formik.errors[valueName];
  const isError = !!errMessage && (!!formik.touched[valueName] || formik.submitCount > 0);

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
    span: label?.length ? 70 : 100,
    ...inputGrid,
  };
  const currentStyle =
    newLabelGrid.span === 100 || (isMobile && (newLabelGrid.xs === 100 || newLabelGrid.sm === 100))
      ? { textAlign: 'start', padding: '5px 0px' }
      : { textAlign: 'end', padding: '5px 10px' };
  // -----------------------MAIN METHODS
  const handleChange = (value: string) => {
    formik.setFieldValue(safeValueName, value);
  };

  // -----------------------RENDER
  return (
    <Frow {...newRowProps} style={{ marginTop: '10px' }}>
      {label?.length ? (
        <Fcol {...newLabelGrid} style={currentStyle}>
          <span>{label}:</span>
        </Fcol>
      ) : null}

      <Fcol {...newInputGrid}>
        <Select
          disabled={disabled}
          value={formik.values[valueName] as string}
          onChange={handleChange}
          placeholder={placeholder}
          options={options}
          style={{ width: '100%' }}
        />
      </Fcol>

      <Fcol>
        {isError ? (
          <div style={{ paddingLeft: 15 }} className='customHelper'>
            {String(errMessage)}
          </div>
        ) : null}
      </Fcol>
    </Frow>
  );
}
