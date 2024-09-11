type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Crea una copia de un objeto y elimina las props especificadas en el array "keys".
 * @param obj El objeto a ser clonado y del que se eliminar n las claves.
 * @param keys Las claves a eliminar.
 * @returns Un nuevo objeto con las mismas propiedades que "obj", excepto que se han eliminado las claves especificadas en "keys".
 *
 * @example
 * interface Example {
 *   a: string;
 *   b: number;
 *   c: boolean;
 * }
 *
 * // Ejemplo de uso
 * const example: Example = { a: "hello", b: 123, c: true };
 * const result = omit(example, ["b", "c"]);
 *
 * // Resulta en: { a: "hello" }
 * console.log(result);
 */
export function omitProps<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  // Crear una copia del objeto original
  const newObj = { ...obj };

  // Remover las claves especificadas
  for (const key of keys) {
    delete newObj[key];
  }

  return newObj as Omit<T, K>;
}
