export const IMAGE_GENERATED_DISPLAY_SIZE = '512x512';

export const FLAG_WITH_PROMPT_ENHANCER = true;

export const IMAGE_PROMPT_ENHANCER = (prompt: string) =>
  `Please help me refine the following prompt for image generation using openai.images.generate. The original prompt is: '${prompt}' I want the resulting prompt to be more specific and detailed, indicating visual style, background, lighting, and other features that will help achieve a higher quality and more realistic image but at the same time keep it simple and easy to understand. ONLY answer the prompt, avoid answering things like "Sure! Here’s a refined and detailed prompt", I only need the prompt, please.`;

export const IMAGE_KEYWORDS = [
  'dibuja',
  'genera una imagen',
  'crea una imagen',
  'pintura de',
  'imagen de',
  'me gustaría una imagen de',
  'podrías crear una imagen de',
  'necesito una ilustración de',
  'representa gráficamente',
  'representa graficamente',
  'ilustra',
  'draw',
  'generate an image of',
  'create an image of',
  'painting of',
  'image of',
  'i would like an image of',
  'could you create an image of',
  'i need an illustration of',
  'illustrate',
];
