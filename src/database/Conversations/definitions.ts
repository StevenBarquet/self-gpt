export type Conversation = {
  pinnedOrder?: number;
  gptonly: boolean; // true si es una conversacion
  name?: string; // Solo existe si es una conversacion de usuario
  gpt_base?: string; // Solo existe si es una conversacion de usuario
  timestamp: string; // Date.toIsoString()
};
