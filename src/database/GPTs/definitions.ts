import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources';

export type GPT = {
  name: string;
  icon: string;
  defaultModel: ChatCompletionCreateParamsNonStreaming['model']; // 'some GPT model';
  timestamp: string; // Date.toIsoString()
  description: string;
};
