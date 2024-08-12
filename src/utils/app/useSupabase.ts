import { createClient } from '@supabase/supabase-js';
import { useKeysStore } from 'src/store/keys';
import { swalApiError } from '../functions/alertUtils';
import { WithId } from '../functions/typesUtils';
import { GPT } from 'src/database/GPTs/definitions';
import { Conversation } from 'src/database/Conversations/definitions';
import { useState } from 'react';
import { Message } from 'src/database/Messages/definitions';
import { useAppLogicStore } from 'src/store/appLogic';

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
        .from('gpts')
        .select('*')
        .order('timestamp', { ascending: false });

      return data as unknown as null | WithId<GPT>[];
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function getConversations() {
    try {
      setIsLoading(true);
      const { data } = await supabase
        .from('conversations')
        .select('*')
        // .not('gptonly', 'eq', true)
        .order('timestamp', { ascending: false });

      return data as unknown as null | WithId<Conversation>[];
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
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

  async function createNewChat({ name, gpt_base }: { name: string; gpt_base: string }) {
    try {
      setIsLoading(true);
      const currentDate = new Date().toISOString();

      const { data, error } = await supabase
        .from('conversations')
        .insert<Partial<Conversation>>([{ timestamp: currentDate, name, gpt_base }])
        .select()
        .single();

      if (error) throw error;

      return data as unknown as WithId<Conversation>;
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteConversation(conversationId: string) {
    try {
      setIsLoading(true);

      // Elimina la conversación
      const { error: deleteConversationError } = await supabase
        .from('conversations')
        .delete()
        .match({ id: conversationId });

      if (deleteConversationError) throw deleteConversationError;

      console.log('Conversación eliminada exitosamente.');
      await populateConversations(); // Volver a cargar conversaciones
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteMessage(id: string, reloadMsgs: () => void) {
    try {
      setIsLoading(true);

      // Elimina la conversación
      const { error } = await supabase.from('messages').delete().match({ id });

      if (error) throw error;

      console.log('Conversación eliminada exitosamente.');
      reloadMsgs(); // Volver a cargar conversaciones
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function addContext(context: Message[]) {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.from('messages').insert(context);

      if (error) throw error;

      return data as unknown as WithId<Message>[];
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  async function getChat(chatId: string) {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation', chatId)
        .order('timestamp', { ascending: true });

      return data as unknown as null | WithId<Message>[];
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al conectarse con SUPABASE');
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
        .from('messages')
        .update({ context: newContextValue })
        .eq('id', message.id); // Asegúrate de que 'id' es el nombre de la columna clave primaria

      if (error) {
        throw error; // Lanza el error si hay problemas
      }

      // Devuelve el nuevo valor del contexto o el mensaje actualizado como desees
      return { ...message, context: newContextValue };
    } catch (error: any) {
      console.log(error);
      await swalApiError(error?.message || 'Error al actualizar el contexto en Supabase');
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
    populateConversations,
    getChat,
    createNewChat,
    addContext,
    deleteConversation,
    toggleContext,
    deleteMessage,
  };
}
