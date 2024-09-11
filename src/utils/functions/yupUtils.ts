import { Schema } from 'yup';

/** Valida un objeto contra su esquema de yup y arroja una excepcion en caso de que el objeto no coincida */
export function yupSimpleValidator<T, K>(
  data: T,
  schema: Schema<K>,
): { isError: false } | { isError: true; errMessage: string } {
  try {
    schema.validateSync(data);
    return { isError: false };
  } catch (error) {
    return { isError: true, errMessage: (error as Error)?.message };
  }
}
