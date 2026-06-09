import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  geminiReadingResponseSchema,
  type GeminiReadingResponse,
} from './types';
import type { SajuResult } from '../saju/types';
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts';
import { retrieveKnowledge } from '../saju/knowledge';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateReadings(
  name: string,
  result: SajuResult
): Promise<GeminiReadingResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json',
    },
    systemInstruction: SYSTEM_PROMPT,
  });

  const userPrompt = buildUserPrompt(name, result, retrieveKnowledge(result));
  const response = await model.generateContent(userPrompt);
  const text = response.response.text();

  try {
    return geminiReadingResponseSchema.parse(JSON.parse(text));
  } catch {
    throw new Error('Gemini returned an invalid reading response');
  }
}
