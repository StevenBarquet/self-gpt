import { createClient } from '@supabase/supabase-js';
import { useKeysStore } from 'src/store/keys';
import { swalApiError } from '../functions/alertUtils';
import { WithId } from '../functions/typesUtils';
import { GPT } from 'src/database/GPTs/definitions';
import { Conversation } from 'src/database/Conversations/definitions';
import { useState } from 'react';

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
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .not('fromContext', 'eq', true)
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
  // -----------------------AUX METHODS
  // -----------------------RENDER
  return {
    supabase,
    isLoading,
    getGPts,
    getConversations,
  };
}
