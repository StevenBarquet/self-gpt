import { type Message } from 'src/database/Messages/definitions';

export const SUPPORTED_MODELS: {
  value: Message['model'];
  label: string;
  title: string;
}[] = [
  {
    value: 'gpt-4o-mini',
    label: 'GPT-4o mini',
    title:
      'Cheapest and fast model. It is multimodal (accepting text or image inputs and outputting text), has higher intelligence than gpt-3.5-turbo but is just as fast.',
  },
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    title:
      'Our versatile, high-intelligence flagship model for complex, multi-step tasks. GPT-4o is cheaper and faster than GPT-4 Turbo. Currently points to gpt-4o-2024-05-13.',
  },
  {
    value: 'o3-mini',
    label: 'O3 mini',
    title:
      'o3-mini is our most recent small reasoning model, providing high intelligence at the same cost and latency targets of o1-mini. o3-mini also supports key developer features.',
  },
  {
    value: 'o3',
    label: 'O3',
    title:
      'The o3 reasoning model is designed to solve hard problems across domains. o1-mini is a faster and more affordable reasoning model',
  },
  {
    value: 'gpt-5',
    label: 'GPT-5',
    title: 'Most advanced model in 2025',
  },
  {
    value: 'gpt-5-mini',
    label: 'GPT-5 mini',
    title: 'Dummy version of GPT-5',
  },
];
