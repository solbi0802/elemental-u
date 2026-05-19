import type { SajuReadings } from '@/lib/saju/types';
import type { GeminiReadingResponse } from './types';

/* Wrap the Gemini JSON output (six { content, keyInsight } sections) into
   the SajuReadings shape the UI consumes (adds title + icon per section).
   Shared between the webhook handler, retry-readings, and the dev bypass
   path so the contract stays consistent. */
export function shapeReadings(gemini: GeminiReadingResponse): SajuReadings {
  return {
    lifeFortune: { title: 'Life Fortune', icon: '📜', ...gemini.lifeFortune },
    yearFortune: { title: '2026 Fortune', icon: '🐍', ...gemini.yearFortune },
    career: { title: 'Career Reading', icon: '💼', ...gemini.career },
    love: { title: 'Love Reading', icon: '💕', ...gemini.love },
    health: { title: 'Health Reading', icon: '🏥', ...gemini.health },
    wealth: { title: 'Wealth Reading', icon: '💰', ...gemini.wealth },
  };
}
