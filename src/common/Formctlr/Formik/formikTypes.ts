/** Top level field of the form values, or a nested path inside it (e.g. "messages.0.content") */
export type FormikFieldName<T> =
	| Extract<keyof T, string>
	| `${Extract<keyof T, string>}.${string}`;
