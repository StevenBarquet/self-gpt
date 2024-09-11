import { useFormik } from 'formik';
import { createGptSchema, validateContext } from './validations';
import { swalApiError, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
import { Message } from 'src/database/Messages/definitions';
import { useSupabase } from 'src/utils/app/useSupabase';
import { omitProps } from 'src/utils/functions/dataTransformUtils';

type ICreateGptValues = {
  name: string;
  icon: string;
  defaultmodel?: string;
  description: string;
  context: string;
};
const INITAL_STATE: ICreateGptValues = {
  name: '',
  icon: '',
  description: '',
  context: '',
};

export function useCreateGptForm() {
  // -----------------------CONSTS, HOOKS, STATES
  const { createGptConversation, createGpt, addContext, populateGpts } = useSupabase();

  const formik = useFormik<ICreateGptValues>({
    initialValues: INITAL_STATE,
    validationSchema: createGptSchema,
    onSubmit: onSubmit,
    onReset: async (_, formikHelpers) => {
      await formikHelpers.setValues(INITAL_STATE);
      return;
    },
  });
  // -----------------------MAIN METHODS
  async function onSubmit(values: ICreateGptValues) {
    try {
      const ctx = onValidateContext(values.context);
      if (ctx.isError) throw new Error(ctx.errMessage);
      const conversation = await createGptConversation();
      if (!conversation) throw new Error('Error creating conversation');
      const newGpt = { ...omitProps(values, ['context']), conversation: conversation.id };
      const gpt = await createGpt(newGpt);
      if (!gpt) throw new Error('Error creating GPT');
      const ctxMessages = buildCtxMessages({
        values,
        conversation: conversation.id,
        gpt: gpt.id,
        ctx: ctx.parsedContext,
      });
      await addContext(ctxMessages);
      populateGpts();
      formik.resetForm();
      swalApiSuccessAuto(`GPT ${values.name} created ✅✅✅`);
    } catch (error) {
      swalApiError((error as Error)?.message);
    }
  }
  // -----------------------AUX METHODS
  function onValidateContext(ctx: string) {
    const validation = validateContext(ctx);
    if (validation.isError) {
      swalApiError(`${validation.errMessage}\nPlease check your context!`);
    }
    return validation;
  }
  function buildCtxMessages({
    values,
    ctx,
    conversation,
    gpt,
  }: {
    values: ICreateGptValues;
    gpt: string;
    conversation: string;
    ctx: { role: string; content: string }[];
  }) {
    const messages = ctx.map((msg, i) => {
      const currentDate = new Date(`2023-01-10 06:0${i}:00+00`);
      const validMsg: Message = {
        role: msg.role as Message['role'], // Is already validated with yup
        content: msg.content,
        timestamp: currentDate.toISOString(),
        model: values.defaultmodel as Message['model'], // The options in the dropdown are valid options
        originalcontext: true,
        context: true,
        conversation,
        gpt,
      };

      return validMsg;
    });

    return messages;
  }
  // -----------------------HOOK DATA

  return { formik };
}
