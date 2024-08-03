import { type Dispatch, type SetStateAction, useState, ChangeEvent } from 'react';

/**
 * Una simple abstracción para jugar con un input, tener operaciones comunes y
 * controlar el estado del input.
 * @param {string} defaultValue - defaultValue: Valor inicial del input.
 * @returns {ReturnUseBoolean} ReturnType - Objeto con las siguientes propiedades:
 * - value - El valor actual del input.
 * - setValue: - Una función para cambiar el valor del input por el parámetro recibido.
 * - setTrue: - Una función para establecer el valor input en verdadero.
 * - setFalse: - Una función para establecer el valor input en falso.
 * - toggle: - Una función para alternar el input.
 */
export function useInput(defaultValue = '') {
  const [value, setValue] = useState(defaultValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value || '');
  };

  return {
    value,
    onChange,
    setValue,
  };
}
