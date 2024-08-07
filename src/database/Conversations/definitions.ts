export type Conversation = {
  pinnedOrder?: number;
  gptOnly: boolean; // true si es una conversacion
  timestamp: string; // Date.toIsoString()
};
