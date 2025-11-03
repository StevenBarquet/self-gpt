import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import type { Conversation } from "src/database/Conversations/definitions";
import type { GPT } from "src/database/GPTs/definitions";
import type { Message } from "src/database/Messages/definitions";
import { useAppLogicStore } from "src/store/appLogic";
import { useKeysStore } from "src/store/keys";
import { swalApiError } from "../functions/alertUtils";
import type { WithId } from "../functions/typesUtils";

/**
 * Operaciones con supabase :D
 */
export function useSupabase() {
	// -----------------------CONSTS, HOOKS, STATES
	const { SUPABASE_KEY, SUPABASE_URL } = useKeysStore();
	const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
	const [isLoading, setIsLoading] = useState(false);
	const { update } = useAppLogicStore();
	// -----------------------MAIN METHODS
	async function getGPts() {
		try {
			setIsLoading(true);
			const { data } = await supabase
				.from("gpts")
				.select("*")
				.order("timestamp", { ascending: false });

			// const orderedData = data?.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

			return data as unknown as null | WithId<GPT>[];
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function getGpt(id: string) {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("gpts")
				.select("*")
				.eq("id", id)
				.single();

			if (error) throw error;
			if (!data?.id) throw new Error("Error descargar GTP");

			const original_context = await getOriginalContext(data.id);

			if (!data || !original_context)
				throw new Error("Error descargar contexto");

			return { ...data, original_context } as unknown as WithId<
				GPT & { original_context: WithId<Message>[] }
			>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function getConversations() {
		try {
			setIsLoading(true);
			const { data } = (await supabase
				.from("conversations")
				.select("*")) as unknown as {
				data: WithId<Conversation>[] | null;
			};
			// .not('gptonly', 'eq', true)
			// .order('timestamp', { ascending: false }); // No ordenamos en supabase

			const orderedData = data?.sort((a, b) =>
				b.timestamp.localeCompare(a.timestamp),
			);

			return orderedData;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function populateGpts() {
		const data = await getGPts();
		if (data) update({ GPTs: data });
	}

	async function populateConversations() {
		const data = await getConversations();
		if (data) update({ Conversations: data });
	}

	async function createUserChat({
		name,
		gpt_base,
	}: {
		name: string;
		gpt_base: string;
	}) {
		try {
			setIsLoading(true);
			const currentDate = new Date().toISOString();

			const { data, error } = await supabase
				.from("conversations")
				.insert<Conversation>({
					timestamp: currentDate,
					name,
					gpt_base,
					gpt_only: false,
				})
				.select()
				.single();

			if (error) throw error;

			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function createGpt(gpt: GPT) {
		try {
			setIsLoading(true);

			const { data, error } = await supabase
				.from("gpts")
				.insert<GPT>([gpt])
				.select()
				.single();

			if (error) throw error;

			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function updateGpt(id: string, gpt: Partial<GPT>) {
		try {
			setIsLoading(true);

			const { data, error } = await supabase
				.from("gpts")
				.update(gpt)
				.eq("id", id)
				.select()
				.single();

			if (error) throw error;

			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function createGptConversation(gptId: string) {
		try {
			setIsLoading(true);
			const currentDate = new Date().toISOString();

			const { data, error } = await supabase
				.from("conversations")
				.insert<Conversation>([
					{ timestamp: currentDate, gpt_only: true, gpt_base: gptId },
				])
				.select()
				.single();

			if (error) throw error;

			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function getOriginalContextConversation(gptId: string) {
		try {
			setIsLoading(true);
			const { data, error } = await supabase
				.from("conversations")
				.select()
				.eq("gpt_base", gptId)
				.eq("gpt_only", true)
				.single();

			if (error) throw error;

			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		}
	}

	async function deleteConversation(conversationId: string) {
		try {
			setIsLoading(true);

			// Elimina la conversación
			const { error } = await supabase
				.from("conversations")
				.delete()
				.match({ id: conversationId });

			if (error) throw error;

			console.log("Conversación eliminada exitosamente.");
			await populateConversations(); // Volver a cargar conversaciones
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteGpt(id: string) {
		try {
			setIsLoading(true);

			// Elimina la conversación
			const { error } = await supabase.from("gpts").delete().match({ id });

			if (error) throw error;

			console.log("GPT eliminado exitosamente.");
			await populateGpts(); // Volver a cargar conversaciones
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function batchDeleteConversations(ids: string[]) {
		try {
			setIsLoading(true);

			// Elimina las conversaciones en lote
			const { error: deleteConversationsError } = await supabase
				.from("conversations")
				.delete()
				.in("id", ids); // Usar 'in' para eliminar múltiples IDs

			if (deleteConversationsError) throw deleteConversationsError;

			console.log("Conversaciones eliminadas exitosamente.");
			await populateConversations(); // Volver a cargar conversaciones
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function batchDeleteGpt(ids: string[]) {
		try {
			setIsLoading(true);

			// Elimina las conversaciones en lote
			const { error: deleteConversationsError } = await supabase
				.from("gpts")
				.delete()
				.in("id", ids); // Usar 'in' para eliminar múltiples IDs

			if (deleteConversationsError) throw deleteConversationsError;

			console.log("Conversaciones eliminadas exitosamente.");
			await populateGpts(); // Volver a cargar conversaciones
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function deleteMessage(id: string, reloadMsgs: () => void) {
		try {
			setIsLoading(true);

			// Elimina la conversación
			const { error } = await supabase.from("messages").delete().match({ id });

			if (error) throw error;

			console.log("Conversación eliminada exitosamente.");
			reloadMsgs(); // Volver a cargar conversaciones
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function addContext(context: Message[]) {
		try {
			setIsLoading(true);

			const { data, error } = await supabase.from("messages").insert(context);

			if (error) throw error;

			updateChatDate(context); // Sin await en segundo plano actualizamos la fecha de la conversación

			return data as unknown as WithId<Message>[];
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function updateChatDate(msgs: Message[]) {
		try {
			const [{ conversation }] = msgs; // Warning: Si no hay un elemento se rompe
			const currentDate = new Date().toISOString();

			const { data, error } = await supabase
				.from("conversations")
				.update({ timestamp: currentDate }) // Actualiza el campo timestamp
				.eq("id", conversation) // Filtra por el ID de la conversación
				.select()
				.single();

			if (error) throw error;
			await populateConversations();
			return data as unknown as WithId<Conversation>;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		}
	}

	async function getChat(chatId: string) {
		setIsLoading(true);
		try {
			const { data } = await supabase
				.from("messages")
				.select("*")
				.eq("conversation", chatId)
				.order("timestamp", { ascending: true });

			return data as unknown as null | WithId<Message>[];
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function toggleContext(message: WithId<Message>) {
		setIsLoading(true);

		try {
			// Se obtiene el nuevo valor alternando el valor actual
			const newContextValue = !message.context;

			// Se actualiza el mensaje en la base de datos
			const { error } = await supabase
				.from("messages")
				.update({ context: newContextValue })
				.eq("id", message.id); // Asegúrate de que 'id' es el nombre de la columna clave primaria

			if (error) {
				throw error; // Lanza el error si hay problemas
			}

			// Devuelve el nuevo valor del contexto o el mensaje actualizado como desees
			return { ...message, context: newContextValue };
		} catch (error: any) {
			console.log(error);
			await swalApiError(
				error?.message || "Error al actualizar el contexto en Supabase",
			);
			return null;
		} finally {
			setIsLoading(false);
		}
	}

	async function getOriginalContext(gptId: string) {
		try {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.filter("gpt", "eq", gptId)
				.filter("original_context", "eq", true)
				.order("timestamp", { ascending: true });

			if (error) throw error;

			return data as unknown as WithId<Message>[] | null;
		} catch (error: any) {
			console.log(error);
			await swalApiError(error?.message || "Error al conectarse con SUPABASE");
			return null;
		} finally {
			setIsLoading(false);
		}
	}
	// -----------------------AUX METHODS
	// -----------------------RENDER
	return {
		supabase,
		isLoading,
		populateGpts,
		getGpt,
		getOriginalContext,
		getOriginalContextConversation,
		populateConversations,
		getChat,
		createUserChat,
		addContext,
		deleteConversation,
		toggleContext,
		deleteMessage,
		deleteGpt,
		batchDeleteConversations,
		batchDeleteGpt,
		createGptConversation,
		createGpt,
		updateGpt,
	};
}
