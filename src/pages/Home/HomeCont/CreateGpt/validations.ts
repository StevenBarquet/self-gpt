import { yupSimpleValidator } from 'src/utils/functions/yupUtils';
import * as yup from 'yup';

const svgPattern = /^<svg[\s\S]*<\/svg>$/;

export const createGptSchema = yup.object().shape({
  name: yup
    .string()
    .max(20, 'Title must be at most 20 characters long')
    .required('Title is required'),

  icon: yup
    .string()
    .matches(svgPattern, 'Icon must be valid SVG HTML code')
    .required('Icon is required'),

  default_model: yup.string().required('Default model is required'),

  description: yup
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .required('Description is required'),

  context: yup
    .string()
    .min(20, 'Context must be at least 20 characters long')
    .required('Context is required'),
});

// Define the validation for an array of messages
export const contextSchema = yup
  .array()
  .of(
    yup.object({
      role: yup
        .string()
        .oneOf(
          ['user', 'assistant', 'system', 'function', 'tool'],
          'Role must be one of: user, assistant, system, function, tool',
        )
        .required('Role is required'),
      content: yup.string().required('Content is required'),
    }),
  )
  .min(0)
  .required('Array is required');

export const validateContext = (
  context: string,
):
  | { isError: false; parsedContext: { role: string; content: string }[] }
  | { isError: true; errMessage: string } => {
  let parsed;

  try {
    parsed = JSON.parse(context); // Try to parse the input as JSON
  } catch (error) {
    return { isError: true, errMessage: 'Input must be valid JSON' };
  }

  const result = yupSimpleValidator(parsed, contextSchema);

  if (!result.isError) {
    return {
      isError: result.isError,
      parsedContext: parsed as unknown as { role: string; content: string }[],
    };
  }

  return result;
};
