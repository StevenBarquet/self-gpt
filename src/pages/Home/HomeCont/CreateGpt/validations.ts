import { yupSimpleValidator } from "src/utils/functions/yupUtils";
import * as yup from "yup";

const svgPattern = /^<svg[\s\S]*<\/svg>$/;

export const CONTEXT_MODES = ["json", "chat"] as const;
export type ContextMode = (typeof CONTEXT_MODES)[number];

// "function" and "tool" are left out on purpose: the API rejects them without tool-call metadata
export const CONTEXT_CHAT_ROLES = ["system", "user", "assistant"] as const;

export type IContextMessage = { role: string; content: string };

export type ContextValidation =
	| { isError: false; parsedContext: IContextMessage[] }
	| { isError: true; errMessage: string };

export const contextMessagesSchema = yup
	.array()
	.of(
		yup.object({
			role: yup
				.string()
				.oneOf(
					[...CONTEXT_CHAT_ROLES],
					`Role must be one of: ${CONTEXT_CHAT_ROLES.join(", ")}`,
				)
				.required("Role is required"),
			content: yup.string().trim().required("Message content is required"),
		}),
	)
	.min(1, "Add at least one message to your context")
	.required("Add at least one message to your context");

const gptBaseSchema = yup.object().shape({
	name: yup
		.string()
		.max(20, "Title must be at most 20 characters long")
		.required("Title is required"),

	icon: yup
		.string()
		.matches(svgPattern, "Icon must be valid SVG HTML code")
		.required("Icon is required"),

	default_model: yup.string().required("Default model is required"),

	description: yup
		.string()
		.min(2, "Description must be at least 2 characters long")
		.required("Description is required"),
});

/** Only the editor that is active (JSON or Chat) gets validated */
export const getCreateGptSchema = (mode: ContextMode) =>
	gptBaseSchema.shape({
		context:
			mode === "json"
				? yup
						.string()
						.min(20, "Context must be at least 20 characters long")
						.required("Context is required")
				: yup.string(),
		contextMessages: mode === "chat" ? contextMessagesSchema : yup.array(),
	});

/**
 * Chat content is plain text, so it is serialized with JSON.stringify: quotes ("),
 * backslashes and line breaks get escaped automatically and the result always parses back
 */
export const messagesToJson = (messages: IContextMessage[]): string => {
	const filled = messages
		.filter((msg) => msg.content.trim())
		.map(({ role, content }) => ({ role, content }));
	return filled.length ? JSON.stringify(filled, null, 2) : "";
};

// Define the validation for an array of messages
export const contextSchema = yup
	.array()
	.of(
		yup.object({
			role: yup
				.string()
				.oneOf(
					["user", "assistant", "system", "function", "tool"],
					"Role must be one of: user, assistant, system, function, tool",
				)
				.required("Role is required"),
			content: yup.string().required("Content is required"),
		}),
	)
	.min(0)
	.required("Array is required");

// Characters that form a valid JSON escape sequence when preceded by "\"
const VALID_JSON_ESCAPES = new Set(["\"", "\\", "/", "b", "f", "n", "r", "t", "u"]);

/**
 * Walks the input tracking whether we are inside a JSON string, and escapes
 * raw characters that would otherwise make JSON.parse fail:
 *  - raw control chars inside strings (line breaks, tabs, ...) -> \n, \t, ...
 *  - lone backslashes that are not a valid escape -> \\ (paths, regex, LaTeX)
 * This lets users paste more natural multi-line text. It does NOT try to fix
 * unescaped double quotes embedded inside the content, since telling a closing
 * quote apart from an embedded one is ambiguous.
 */
const escapeRawStringContent = (input: string): string => {
	let out = "";
	let inString = false;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i];

		if (!inString) {
			if (ch === '"') inString = true;
			out += ch;
			continue;
		}

		// Inside a string literal
		if (ch === "\\") {
			const next = input[i + 1];
			if (next !== undefined && VALID_JSON_ESCAPES.has(next)) {
				out += ch + next; // keep valid escape sequence as-is
				i++;
			} else {
				out += "\\\\"; // lone backslash -> escape it
			}
			continue;
		}

		if (ch === '"') {
			inString = false;
			out += ch;
			continue;
		}

		switch (ch) {
			case "\n":
				out += "\\n";
				break;
			case "\r":
				out += "\\r";
				break;
			case "\t":
				out += "\\t";
				break;
			case "\b":
				out += "\\b";
				break;
			case "\f":
				out += "\\f";
				break;
			default:
				if (ch < " ") {
					out += `\\u${ch.charCodeAt(0).toString(16).padStart(4, "0")}`;
				} else {
					out += ch;
				}
		}
	}

	return out;
};

/**
 * Removes trailing commas before a closing "}" or "]", ignoring commas that
 * live inside string literals.
 */
const removeTrailingCommas = (input: string): string => {
	let out = "";
	let inString = false;

	for (let i = 0; i < input.length; i++) {
		const ch = input[i];

		if (inString) {
			out += ch;
			if (ch === "\\") {
				out += input[i + 1] ?? "";
				i++;
			} else if (ch === '"') {
				inString = false;
			}
			continue;
		}

		if (ch === '"') {
			inString = true;
			out += ch;
			continue;
		}

		if (ch === ",") {
			let j = i + 1;
			while (j < input.length && /\s/.test(input[j])) j++;
			if (input[j] === "}" || input[j] === "]") continue; // drop trailing comma
		}

		out += ch;
	}

	return out;
};

export const validateContextMessages = (
	messages: IContextMessage[],
): ContextValidation => {
	const result = yupSimpleValidator(messages, contextMessagesSchema);
	if (result.isError) return result;

	return {
		isError: false,
		parsedContext: messages.map(({ role, content }) => ({ role, content })),
	};
};

export const validateContext = (context: string): ContextValidation => {
	let parsed;

	// Relax strict JSON so pasted natural text (line breaks, tabs, Windows
	// paths, trailing commas) parses without the user having to escape it.
	const sanitized = removeTrailingCommas(escapeRawStringContent(context));

	try {
		parsed = JSON.parse(sanitized); // Try to parse the sanitized input as JSON
	} catch (error) {
		return {
			isError: true,
			errMessage:
				'Input must be valid JSON. Tip: an unescaped double quote (") inside your text can break it — use \\" instead.',
		};
	}

	const result = yupSimpleValidator(parsed, contextSchema);

	if (!result.isError) {
		return {
			isError: result.isError,
			parsedContext: parsed as unknown as IContextMessage[],
		};
	}

	return result;
};
