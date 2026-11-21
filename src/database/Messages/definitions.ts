import type { ChatCompletionMessageParam } from "openai/resources";
import type { AiModel } from "src/SUPPORTED_MODELS";

export type Message = {
	role: ChatCompletionMessageParam["role"];
	content: string;
	model: AiModel;
	timestamp: string; // Date.toIsoString()
	context: boolean;
	original_context: boolean;
	is_image_prompt?: boolean;
	gpt: string; // foreign key to GPTs
	conversation: string; // foreign key to GPTs
};
