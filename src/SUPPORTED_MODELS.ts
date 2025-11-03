import type { ChatCompletionMessageParam } from "openai/resources";
import type { Message } from "src/database/Messages/definitions";

export const SUPPORTED_MODELS: {
	value: Message["model"];
	label: string;
	title: string;
}[] = [
	{
		value: "gpt-4o-mini",
		label: "GPT-4o mini",
		title:
			"Cheapest and fast model. It is multimodal (accepting text or image inputs and outputting text), has higher intelligence than gpt-3.5-turbo but is just as fast.",
	},
	{
		value: "gpt-4o",
		label: "GPT-4o",
		title:
			"Our versatile, high-intelligence flagship model for complex, multi-step tasks. GPT-4o is cheaper and faster than GPT-4 Turbo. Currently points to gpt-4o-2024-05-13.",
	},
	{
		value: "o3-mini",
		label: "O3 mini",
		title:
			"o3-mini is our most recent small reasoning model, providing high intelligence at the same cost and latency targets of o1-mini. o3-mini also supports key developer features.",
	},
	{
		value: "o3",
		label: "O3",
		title:
			"The o3 reasoning model is designed to solve hard problems across domains. o1-mini is a faster and more affordable reasoning model",
	},
	{
		value: "gpt-5",
		label: "GPT-5",
		title: "Most advanced model in 2025",
	},
	{
		value: "gpt-5-mini",
		label: "GPT-5 mini",
		title: "Dummy version of GPT-5",
	},
];
export const FORMAT_CONTEXT: ChatCompletionMessageParam[] = [
	{
		role: "system",
		content: [
			"Instrucciones para formatear código:",
			"- Para cualquier fragmento de código MULTILÍNEA, usa SIEMPRE bloques con triple backtick (fences).",
			"- La apertura debe ser: ```<lenguaje> en minúsculas, seguida de un salto de línea.",
			"- Cierra SIEMPRE el bloque con ``` en una línea separada.",
			"- No uses bloques indentados (4 espacios) para código multilínea.",
			"- No incluyas comillas invertidas dentro del bloque, ni inicies otro bloque dentro de uno.",
			"Ejemplo de formato correcto:",
			"```ts",
			"function helloWorld() {",
			'  console.log("Hello, World!");',
			"}",
			"```",
		].join("\n"),
	},

	// 2) Fórmulas y expresiones matemáticas
	{
		role: "system",
		content: [
			"Instrucciones para formatear fórmulas y expresiones matemáticas:",
			"",
			"- Usa SIEMPRE un bloque cercado con triple backtick y el identificador «latex» en minúsculas. Ejemplo:",
			"  ```latex",
			"  x^2 + y^2 = z^2",
			"  ```",
			"- Dentro del bloque:",
			"  • No incluyas líneas en blanco al inicio ni al final.",
			"  • No uses comillas invertidas (`) ni anides otros bloques.",
			"  • No envuelvas la expresión con símbolos de dólar ($).",
			"  • Evita comentarios con %.",
			"  • Escapa caracteres especiales (#, &, _, ^, ~) cuando apliquen.",
			"- Para modo display o ecuaciones múltiples, emplea entornos LaTeX estándar:",
			"  • equation*, align*, gathered, cases, pmatrix, bmatrix, etc.",
			"  • Alinea varias ecuaciones con & y separa líneas con \\\\.",
			"- Si necesitas macros, declara \\newcommand al principio del bloque.",
			"- Explicaciones y texto descriptivo van FUERA del bloque; dentro, solo código LaTeX.",
		].join("\\n"),
	},
	// 3) Cualquier otro texto (no código ni fórmulas)
	{
		role: "system",
		content: [
			"Instrucciones para formatear cualquier otro texto (No código ni fórmulas):",
			"",
			"- No uses bloques cercados ni formato de código.",
			"- Emplea Markdown claro y elegante, estilo README de GitHub: encabezados jerárquicos (##, ###), listas con viñetas y numeradas, tablas simples y enlaces descriptivos.",
			"- Usa emojis con moderación para mejorar la legibilidad (por ejemplo al inicio de títulos o bullets clave). Máximo 1–3 por sección, sin repetir en exceso. Ejemplos: ✅, 💡, ⚠️, 📌.",
			"- Estructura sugerida: introducción breve, secciones con subtítulos, pasos o bullets, y un resumen o TL;DR al final si el texto es largo.",
			"- Resalta conceptos clave con negritas y términos nuevos con itálicas en su primera mención. Explica siglas al primer uso.",
			"- Para notas, consejos y advertencias, utiliza citas con un prefijo claro (por ejemplo: Nota:, Consejo:, Advertencia:).",
			"- Evita paredes de texto: párrafos de 2–4 líneas y oraciones concisas.",
			"- Mantén un tono neutral, evitando sesgos culturales o regionales.",
			"- Si el contenido requiere código o fórmulas, remite a las reglas específicas correspondientes.",
		].join("\n"),
	},
];
