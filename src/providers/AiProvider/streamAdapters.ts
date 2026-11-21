// ---Dependencies
import { type Content, GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
// ---Config
import type { Message } from 'src/database/Messages/definitions';
import {
  type AiModel,
  type AiProvider,
  FORMAT_CONTEXT,
  type ProviderEffort,
} from 'src/SUPPORTED_MODELS';

export interface StreamParams {
  model: AiModel;
  /** Historial ya filtrado; incluye los mensajes 'system' del contexto original del GPT */
  context: Pick<Message, 'role' | 'content'>[];
  prompt: string;
  signal: AbortSignal;
  /** `undefined` si el modelo no soporta effort: se omite el parámetro y el modelo usa su default */
  effort?: ProviderEffort;
}

/** Ejecuta el prompt en el SDK del proveedor y entrega la respuesta como fragmentos de texto */
export type StreamCompletion = (params: StreamParams) => AsyncGenerator<string>;

/** `undefined` cuando no hay API key guardada para ese proveedor */
export type StreamAdapters = Record<AiProvider, StreamCompletion | undefined>;

export function createStreamAdapters(keys: {
  OPEN_AI_API_KEY?: string;
  GEMINI_API_KEY?: string;
}): StreamAdapters {
  return {
    openai: keys.OPEN_AI_API_KEY ? createOpenAiStream(keys.OPEN_AI_API_KEY) : undefined,
    gemini: keys.GEMINI_API_KEY ? createGeminiStream(keys.GEMINI_API_KEY) : undefined,
  };
}

// -----------------------OPENAI

function createOpenAiStream(apiKey: string): StreamCompletion {
  const openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

  return async function* ({ model, context, prompt, signal, effort }) {
    const history = context.map(({ role, content }) => ({
      role,
      content,
    })) as unknown as ChatCompletionMessageParam[];

    const stream = await openai.chat.completions.create(
      {
        messages: [...FORMAT_CONTEXT, ...history, { role: 'user', content: prompt }],
        model,
        stream: true,
        ...(effort && { reasoning_effort: effort.openai }),
      },
      { signal },
    );

    for await (const chunk of stream) {
      const part = chunk.choices[0]?.delta?.content;
      if (part) yield part;
    }
  };
}

// -----------------------GEMINI

const GEMINI_HISTORY_START = '(Inicio de la conversación)';

function createGeminiStream(apiKey: string): StreamCompletion {
  const ai = new GoogleGenAI({ apiKey });

  return async function* ({ model, context, prompt, signal, effort }) {
    const { systemInstruction, contents } = toGeminiRequest(context, prompt);

    const stream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction,
        abortSignal: signal,
        ...(effort && { thinkingConfig: { thinkingLevel: effort.gemini } }),
      },
    });

    for await (const chunk of stream) {
      const part = chunk.text;
      if (part) yield part;
    }
  };
}

const isSystemRole = (role: Message['role']) => role === 'system' || role === 'developer';

/**
 * Gemini no acepta el rol 'system' dentro de `contents`: esos mensajes (FORMAT_CONTEXT + contexto
 * original del GPT) se mandan como `systemInstruction`. El rol 'assistant' se llama 'model'.
 */
function toGeminiRequest(context: StreamParams['context'], prompt: string) {
  const formatInstructions = FORMAT_CONTEXT.map((m) =>
    typeof m.content === 'string' ? m.content : '',
  );
  const gptInstructions = context.filter((m) => isSystemRole(m.role)).map((m) => m.content);

  const systemInstruction = [...formatInstructions, ...gptInstructions]
    .filter(Boolean)
    .join('\n\n');

  const contents: Content[] = context
    .filter((m) => !isSystemRole(m.role))
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  // Parche: si el contexto original del GPT arranca con una respuesta del asistente, el historial
  // empezaría con 'model'; se antepone un turno de usuario para que siempre arranque con 'user'.
  if (contents[0]?.role === 'model') {
    contents.unshift({ role: 'user', parts: [{ text: GEMINI_HISTORY_START }] });
  }

  contents.push({ role: 'user', parts: [{ text: prompt }] });

  return { systemInstruction, contents };
}
