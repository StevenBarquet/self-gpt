import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';

export type Message = {
  role: ChatCompletionMessageParam['role'];
  content: string;
  model: ChatCompletionCreateParamsNonStreaming['model'];
  timestamp: string; // Date.toIsoString()
  context: boolean;
  originalContext: boolean;
  GPT: string; // foreign key to GPTs
  conversation: string; // foreign key to GPTs
};
