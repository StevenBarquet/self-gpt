import { useFormik } from 'formik';
import { createGptSchema, validateContext } from './validations';
import { swalApiError, swalApiSuccessAuto } from 'src/utils/functions/alertUtils';
import { Message } from 'src/database/Messages/definitions';
import { useSupabase } from 'src/utils/app/useSupabase';
import { GPT } from 'src/database/GPTs/definitions';
import { useAppLogicStore } from 'src/store/appLogic';
import { useEffect } from 'react';

export type ICreateGptValues = {
  gptId?: string;
  name: string;
  icon: string;
  default_model?: string;
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
  const {
    createGptConversation,
    createGpt,
    updateGpt,
    getOriginalContextConversation,
    addContext,
    populateGpts,
  } = useSupabase();
  const { createGptInit } = useAppLogicStore();

  const formik = useFormik<ICreateGptValues>({
    initialValues: INITAL_STATE,
    validationSchema: createGptSchema,
    onSubmit: onSubmit,

    onReset: async (_, formikHelpers) => {
      await formikHelpers.setValues(INITAL_STATE);
      return;
    },
  });
  useEffect(() => {
    if (!createGptInit) formik.resetForm();
    else {
      formik.setValues(createGptInit);
    }
  }, [createGptInit]);
  // -----------------------MAIN METHODS
  async function onSubmit(values: ICreateGptValues) {
    const isCreateNew = !values.gptId;
    if (isCreateNew) await onCreateGpt(values);
    else await onUpdateGpt(values);
  }

  async function onCreateGpt(values: ICreateGptValues) {
    try {
      const ctx = onValidateContext(values.context);
      if (ctx.isError) throw new Error(ctx.errMessage);

      const newGpt = buildCreateGpt(values);
      const gpt = await createGpt(newGpt);
      if (!gpt) throw new Error('Error creating GPT');

      const conversation = await createGptConversation(gpt.id);
      if (!conversation) throw new Error('Error creating conversation');

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

  async function onUpdateGpt(values: ICreateGptValues) {
    try {
      const ctx = onValidateContext(values.context);
      if (ctx.isError) throw new Error(ctx.errMessage);

      const gpt = await updateGpt(...buildUpdateGpt(values));
      if (!gpt) throw new Error('Error updating GPT');

      const conversation = await getOriginalContextConversation(gpt.id);
      if (!conversation) throw new Error('Error updating conversation');

      const ctxMessages = buildCtxMessages({
        values,
        conversation: conversation.id,
        gpt: gpt.id,
        ctx: ctx.parsedContext,
      });
      await addContext(ctxMessages);
      populateGpts();
      formik.resetForm();
      swalApiSuccessAuto(`GPT ${values.name} updated ✅✅✅`);
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

  function buildGptBase(values: ICreateGptValues) {
    return {
      name: values.name,
      icon: values.icon,
      default_model: values.default_model as GPT['default_model'], // The options in the dropdown are valid options and validated with yup
      description: values.description,
    };
  }
  function buildCreateGpt(values: ICreateGptValues): GPT {
    return {
      ...buildGptBase(values),
      timestamp: new Date().toISOString(),
    };
  }
  function buildUpdateGpt(values: ICreateGptValues): [string, GPT] {
    return [values.gptId!, buildGptBase(values) as GPT];
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
        model: values.default_model as Message['model'], // The options in the dropdown are valid options
        original_context: true,
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
