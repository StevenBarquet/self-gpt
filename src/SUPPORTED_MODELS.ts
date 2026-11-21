import { type Interactions, ThinkingLevel } from '@google/genai';
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
} from 'openai/resources';
import type { ReasoningEffort } from 'openai/resources/shared';

export type AiProvider = 'openai' | 'gemini';

// Ids de modelo de cada SDK: autocompletan los modelos conocidos y, como ambos incluyen
// `string & {}`, también aceptan ids nuevos que el SDK instalado todavía no conoce.
export type OpenAiModel = ChatCompletionCreateParamsNonStreaming['model'];
export type GeminiModel = Interactions.Model;
export type AiModel = OpenAiModel | GeminiModel;

interface ModelOption<M extends AiModel = AiModel> {
  value: M;
  label: string;
  title: string;
  /** Acepta nivel de razonamiento (`reasoning_effort` en OpenAI, `thinkingLevel` en Gemini) */
  supportEffort: boolean;
}

export const OPEN_AI_MODELS: ModelOption<OpenAiModel>[] = [
  {
    value: 'gpt-6.2-astra',
    label: 'GPT-6.2 ASTRA',
    title: 'Cost 5.4 x12 (use with caution) - $8/0.40/40.00',
    supportEffort: true,
  },
  {
    value: 'gpt-6.2-sol',
    label: 'GPT-6.2 Sol (Coding)',
    title: 'Small, code and automation - $2/0.10/10.00',
    supportEffort: true,
  },
  {
    value: 'gpt-6.1-terra',
    label: 'GPT-6.2 Terra (Human)',
    title: 'Visual and human - $1/0.05/5.00',
    supportEffort: true,
  },
];

// TODO: reemplazar por los modelos elegidos de la doc de Gemini (value = id exacto del modelo)
export const GEMINI_MODELS: ModelOption<GeminiModel>[] = [
  {
    value: 'gemini-4-carbon',
    label: 'Gemini 4 Pro',
    title: 'Version premium - $2/0.10/10.00',
    supportEffort: true,
  },
  {
    value: 'gemini-4-hydrogen',
    label: 'Gemini 4 lite',
    title: 'Cheapest, free tier pero igual es bueno',
    supportEffort: true,
  },
  {
    value: 'gemini-3.8-flash',
    label: 'Gemini 3.8 Flash',
    title: 'prev gemini model',
    supportEffort: false,
  },
];

export const SUPPORTED_MODELS: (ModelOption & { provider: AiProvider })[] = [
  ...OPEN_AI_MODELS.map((m) => ({ ...m, provider: 'openai' as const })),
  ...GEMINI_MODELS.map((m) => ({ ...m, provider: 'gemini' as const })),
];

/**
 * Proveedor (SDK) que ejecuta un modelo. Los modelos que ya no están en la lista (p. ej. guardados
 * en mensajes antiguos) se resuelven por prefijo para no romper conversaciones existentes.
 */
export function getModelProvider(model?: AiModel): AiProvider {
  const provider = SUPPORTED_MODELS.find((m) => m.value === model)?.provider;
  if (provider) return provider;
  return model?.startsWith('gemini') ? 'gemini' : 'openai';
}

/**
 * Si al modelo se le manda effort. Los modelos que no están en la lista (viejos, guardados en
 * mensajes antiguos o como default de un GPT) no lo reciben: si el modelo no soporta el parámetro,
 * la API rechaza la petición.
 */
export function modelSupportsEffort(model?: AiModel): boolean {
  return SUPPORTED_MODELS.find((m) => m.value === model)?.supportEffort ?? false;
}

// -----------------------EFFORT (de menor a mayor: así se pintan en el slider)

export interface EffortOption<V extends string = string> {
  value: V;
  label: string;
}

/** `reasoning_effort` de OpenAI. Se omite 'none' porque apaga el razonamiento en vez de ser un nivel */
export const OPEN_AI_EFFORTS = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'xhigh', label: 'X-High' },
  { value: 'max', label: 'Max' },
] as const satisfies readonly EffortOption<NonNullable<ReasoningEffort>>[];

/** `thinkingConfig.thinkingLevel` de Gemini */
export const GEMINI_EFFORTS = [
  { value: ThinkingLevel.MINIMAL, label: 'Minimal' },
  { value: ThinkingLevel.LOW, label: 'Low' },
  { value: ThinkingLevel.MEDIUM, label: 'Medium' },
  { value: ThinkingLevel.HIGH, label: 'High' },
  { value: ThinkingLevel.XHIGH, label: 'X-High' },
] as const satisfies readonly EffortOption<ThinkingLevel>[];

export type OpenAiEffort = (typeof OPEN_AI_EFFORTS)[number]['value'];
export type GeminiEffort = (typeof GEMINI_EFFORTS)[number]['value'];

/** Effort guardado para cada proveedor; cada adapter usa solo el suyo */
export interface ProviderEffort {
  openai: OpenAiEffort;
  gemini: GeminiEffort;
}

export const FORMAT_CONTEXT: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: [
      'Instrucciones para formatear código:',
      '- Para cualquier fragmento de código MULTILÍNEA, usa SIEMPRE bloques con triple backtick (fences).',
      '- La apertura debe ser: ```<lenguaje> en minúsculas, seguida de un salto de línea.',
      '- Cierra SIEMPRE el bloque con ``` en una línea separada.',
      '- No uses bloques indentados (4 espacios) para código multilínea.',
      '- No incluyas comillas invertidas dentro del bloque, ni inicies otro bloque dentro de uno.',
      'Ejemplo de formato correcto:',
      '```ts',
      'function helloWorld() {',
      '  console.log("Hello, World!");',
      '}',
      '```',
    ].join('\n'),
  },

  // 2) Fórmulas y expresiones matemáticas
  {
    role: 'system',
    content: [
      'Instrucciones para formatear fórmulas y expresiones matemáticas:',
      '',
      '- Usa SIEMPRE un bloque cercado con triple backtick y el identificador «latex» en minúsculas. Ejemplo:',
      '  ```latex',
      '  x^2 + y^2 = z^2',
      '  ```',
      '- Dentro del bloque:',
      '  • No incluyas líneas en blanco al inicio ni al final.',
      '  • No uses comillas invertidas (`) ni anides otros bloques.',
      '  • No envuelvas la expresión con símbolos de dólar ($).',
      '  • Evita comentarios con %.',
      '  • Escapa caracteres especiales (#, &, _, ^, ~) cuando apliquen.',
      '- Para modo display o ecuaciones múltiples, emplea entornos LaTeX estándar:',
      '  • equation*, align*, gathered, cases, pmatrix, bmatrix, etc.',
      '  • Alinea varias ecuaciones con & y separa líneas con \\\\.',
      '- Si necesitas macros, declara \\newcommand al principio del bloque.',
      '- Explicaciones y texto descriptivo van FUERA del bloque; dentro, solo código LaTeX.',
    ].join('\n'),
  },
  // 3) Cualquier otro texto (no código ni fórmulas)
  {
    role: 'system',
    content: [
      'Instrucciones para formatear cualquier otro texto (No código ni fórmulas):',
      '',
      '- No uses bloques cercados ni formato de código.',
      '- Emplea Markdown claro y elegante, estilo README de GitHub: encabezados jerárquicos (##, ###), listas con viñetas y numeradas, tablas simples y enlaces descriptivos.',
      '- Usa emojis con moderación para mejorar la legibilidad (por ejemplo al inicio de títulos o bullets clave). Máximo 1–3 por sección, sin repetir en exceso. Ejemplos: ✅, 💡, ⚠️, 📌.',
      '- Estructura sugerida: introducción breve, secciones con subtítulos, pasos o bullets, y un resumen o TL;DR al final si el texto es largo.',
      '- Resalta conceptos clave con negritas y términos nuevos con itálicas en su primera mención. Explica siglas al primer uso.',
      '- Para notas, consejos y advertencias, utiliza citas con un prefijo claro (por ejemplo: Nota:, Consejo:, Advertencia:).',
      '- Evita paredes de texto: párrafos de 2–4 líneas y oraciones concisas.',
      '- Mantén un tono neutral, evitando sesgos culturales o regionales.',
      '- Si el contenido requiere código o fórmulas, remite a las reglas específicas correspondientes.',
    ].join('\n'),
  },
];
