import { createClient } from '@supabase/supabase-js';
import { useKeysStore } from 'src/store/keys';
import { swalApiError } from '../functions/alertUtils';
import { WithId } from '../functions/typesUtils';
import { GPT } from 'src/database/GPTs/definitions';
import { Conversation } from 'src/database/Conversations/definitions';
import { useState } from 'react';
import { Message } from 'src/database/Messages/definitions';

/**
 * Operaciones con supabase :D
 */
export function useSupabase() {
  // -----------------------CONSTS, HOOKS, STATES
  const { SUPABASE_KEY, SUPABASE_URL } = useKeysStore();
  const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!);
  const [isLoading, setIsLoading] = useState(false);
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

  async function addContext(context: Message[]) {
    try {
      console.log('addContext');

      console.log(context);

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
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return {
    supabase,
    isLoading,
    getGPts,
    getConversations,
    getChat,
    createNewChat,
    addContext,
  };
}
