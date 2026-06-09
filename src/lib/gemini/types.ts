import { z } from 'zod';

const readingSectionSchema = z.object({
  content: z.string().trim().min(40).max(8_000),
  keyInsight: z.string().trim().min(10).max(1_000),
});

export const geminiReadingResponseSchema = z.object({
  lifeFortune: readingSectionSchema,
  yearFortune: readingSectionSchema,
  career: readingSectionSchema,
  love: readingSectionSchema,
  health: readingSectionSchema,
  wealth: readingSectionSchema,
});

export type GeminiReadingResponse = z.infer<typeof geminiReadingResponseSchema>;
