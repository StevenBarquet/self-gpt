export type Conversation = {
  pinned_order?: number;
  gpt_only: boolean; // true si es una conversación que solo almacena mensajes de contexto (para gpts)
  name?: string; // Solo existe si es una conversacion de usuario
  gpt_base: string; // foreign key to GPTs
  timestamp: string; // Date.toIsoString()
};
