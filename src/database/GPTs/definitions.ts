import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';

export type GPT = {
  name: string;
  icon: string;
  defaultmodel: ChatCompletionCreateParamsNonStreaming['model']; // 'some GPT model';
  timestamp: string; // Date.toIsoString()
  description: string;
  conversation: string; // id de la conversación por defecto
};
