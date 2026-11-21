import type { AiModel } from "src/SUPPORTED_MODELS";

export type GPT = {
	name: string;
	icon: string;
	default_model: AiModel; // 'some GPT model';
	timestamp: string; // Date.toIsoString()
	description: string;
};
