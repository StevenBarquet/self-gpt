import type { ReactNode } from 'react';
import { Fcol, Frow, type GridSystem } from 'react-forge-grid';
interface Props {
  colProps?: GridSystem;
  label: string;
  children: ReactNode;
  labelGrid?: GridSystem;
  inputGrid?: GridSystem;
}

/**
 * LabelGridInput Component:  Descripción del comportamiento...
 * @param {Props} props - Parámetros del componente como: ...
 */
export function LabelGridInput(props: Props) {
  // -----------------------CONSTS, HOOKS, STATES

  // -----------------------MAIN METHODS
  // -----------------------AUX METHODS
  // -----------------------RENDER
  if (props.colProps)
    return (
      <Fcol {...props.colProps}>
        <Nested {...props} />
      </Fcol>
    );
  return <Nested {...props} />;
}

function Nested(props: Props) {
  const { label, children } = props;

  return (
    <Frow vAlign='middle' hAlign='start' style={{ marginTop: '10px' }}>
      <span
        style={{
          display: 'block',
          marginBottom: '3px',
          marginTop: '10px',
        }}
      >
        {label}
      </span>
      {children}
    </Frow>
  );
}
