import { useFormik } from "formik";
import { useEffect } from "react";
import type { GPT } from "src/database/GPTs/definitions";
import type { Message } from "src/database/Messages/definitions";
import { useAppLogicStore } from "src/store/appLogic";
import { usePreferencesStore } from "src/store/preferences";
import { useSupabase } from "src/utils/app/useSupabase";
import {
	swalApiConfirm,
	swalApiError,
	swalApiSuccessAuto,
} from "src/utils/functions/alertUtils";
import {
	type ContextMode,
	getCreateGptSchema,
	type IContextMessage,
	messagesToJson,
	validateContext,
	validateContextMessages,
} from "./validations";

export type ICreateGptValues = {
	gptId?: string;
	name: string;
	icon: string;
	default_model?: string;
	description: string;
	context: string;
	contextMessages: IContextMessage[];
};
/** Values used to open the form (e.g. edit mode); the chat messages are derived from `context` */
export type ICreateGptInit = Omit<ICreateGptValues, "contextMessages">;

const newContextMessage = (role = "user"): IContextMessage => ({
	role,
	content: "",
});

const INITAL_STATE: ICreateGptValues = {
	name: "",
	icon: "",
	description: "",
	context: "",
	contextMessages: [newContextMessage()],
};

export function useCreateGptForm() {
	// -----------------------CONSTS, HOOKS, STATES
	const {
		createGptConversation,
		createGpt,
		updateGpt,
		getOriginalContextConversation,
		deleteOriginalContext,
		addContext,
		populateGpts,
	} = useSupabase();
	const { createGptInit } = useAppLogicStore();
	const { contextMode, update: updatePreferences } = usePreferencesStore();

	const formik = useFormik<ICreateGptValues>({
		initialValues: INITAL_STATE,
		// Read from the store (not the render closure) so a tab switch validates with the new mode right away
		validationSchema: () =>
			getCreateGptSchema(usePreferencesStore.getState().contextMode),
		onSubmit: onSubmit,

		onReset: async (_, formikHelpers) => {
			await formikHelpers.setValues(INITAL_STATE);
			return;
		},
	});
	useEffect(() => {
		if (!createGptInit) formik.resetForm();
		else {
			formik.setValues({
				...INITAL_STATE,
				...createGptInit,
				contextMessages: contextToMessages(createGptInit.context),
			});
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
			const ctx = onValidateContext(values);
			if (ctx.isError) throw new Error(ctx.errMessage);

			const newGpt = buildCreateGpt(values);
			const gpt = await createGpt(newGpt);
			if (!gpt) throw new Error("Error creating GPT");

			const conversation = await createGptConversation(gpt.id);
			if (!conversation) throw new Error("Error creating conversation");

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
			const ctx = onValidateContext(values);
			if (ctx.isError) throw new Error(ctx.errMessage);

			const gpt = await updateGpt(...buildUpdateGpt(values));
			if (!gpt) throw new Error("Error updating GPT");

			await deleteOriginalContext(gpt.id);

			const conversation = await getOriginalContextConversation(gpt.id);
			if (!conversation) throw new Error("Error updating conversation");

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
	/** Converts the context between editors so switching tabs never loses work */
	function onChangeContextMode(mode: ContextMode) {
		const { context, contextMessages } = formik.values;
		if (mode === contextMode) return;

		// The preference goes first: the field update below triggers validation with the new mode
		if (mode === "json") {
			updatePreferences({ contextMode: mode });
			formik.setFieldValue("context", messagesToJson(contextMessages));
			return;
		}

		const validation = validateContext(context);
		if (context.trim() && validation.isError) {
			swalApiError(
				`${validation.errMessage}\n\nFix your JSON (or clear it) before switching to Chat mode.`,
			);
			return;
		}

		updatePreferences({ contextMode: mode });
		// A previous submit marks every message as touched, which would flag fresh empty rows
		formik.setTouched({ ...formik.touched, contextMessages: undefined }, false);
		formik.setFieldValue("contextMessages", contextToMessages(context));
	}

	function onAddContextMessage() {
		const messages = formik.values.contextMessages;
		const lastRole = messages[messages.length - 1]?.role;
		const nextRole = lastRole === "user" ? "assistant" : "user";
		formik.setFieldValue("contextMessages", [
			...messages,
			newContextMessage(nextRole),
		]);
	}

	function onDeleteContextMessage(index: number) {
		const message = formik.values.contextMessages[index];
		if (!message?.content.trim()) {
			removeContextMessage(index);
			return;
		}
		swalApiConfirm({
			callback: () => removeContextMessage(index),
			confirmMsg: `Message #${index + 1} has content, it will be lost.`,
			fireSuccess: false,
		});
	}

	function onClearContextMessages() {
		const hasContent = formik.values.contextMessages.some((msg) =>
			msg.content.trim(),
		);
		if (!hasContent) {
			clearContextMessages();
			return;
		}
		swalApiConfirm({
			callback: clearContextMessages,
			confirmMsg: "All your context messages will be removed.",
			fireSuccess: false,
		});
	}
	// -----------------------AUX METHODS
	function onValidateContext(values: ICreateGptValues) {
		const validation =
			contextMode === "chat"
				? validateContextMessages(values.contextMessages)
				: validateContext(values.context);
		if (validation.isError) {
			swalApiError(`${validation.errMessage}\nPlease check your context!`);
		}
		return validation;
	}

	function contextToMessages(context: string): IContextMessage[] {
		const validation = validateContext(context);
		if (validation.isError || !validation.parsedContext.length) {
			return [newContextMessage()];
		}
		return validation.parsedContext.map(({ role, content }) => ({
			role,
			content,
		}));
	}

	// Touched state is index based, so it has to shift along with the removed message
	function removeContextMessage(index: number) {
		const { contextMessages } = formik.values;
		const touched = formik.touched.contextMessages;
		if (Array.isArray(touched)) {
			formik.setTouched(
				{
					...formik.touched,
					contextMessages: touched.filter((_, i) => i !== index),
				},
				false,
			);
		}
		formik.setFieldValue(
			"contextMessages",
			contextMessages.filter((_, i) => i !== index),
		);
	}

	function clearContextMessages() {
		formik.setTouched({ ...formik.touched, contextMessages: undefined }, false);
		formik.setFieldValue("contextMessages", [newContextMessage()]);
	}

	function buildGptBase(values: ICreateGptValues) {
		return {
			name: values.name,
			icon: values.icon,
			default_model: values.default_model as GPT["default_model"], // The options in the dropdown are valid options and validated with yup
			description: values.description,
		};
	}
	function buildCreateGpt(values: ICreateGptValues): GPT {
		return {
			...buildGptBase(values),
			timestamp: new Date().toISOString(),
		};
	}
	function buildUpdateGpt(values: ICreateGptValues): [string, Partial<GPT>] {
		return [values.gptId!, buildGptBase(values)];
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
		ctx: IContextMessage[];
	}) {
		const messages = ctx.map((msg, i) => {
			const currentDate = new Date(`2023-01-10 06:0${i}:00+00`);
			const validMsg: Message = {
				role: msg.role as Message["role"], // Is already validated with yup
				content: msg.content,
				timestamp: currentDate.toISOString(),
				model: values.default_model as Message["model"], // The options in the dropdown are valid options
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

	return {
		formik,
		contextMode,
		onChangeContextMode,
		onAddContextMessage,
		onDeleteContextMessage,
		onClearContextMessages,
	};
}
