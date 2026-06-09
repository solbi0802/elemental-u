import type { SajuReadings } from '@/lib/saju/types';
import type { GeminiReadingResponse } from './types';

export function shapeReadings(gemini: GeminiReadingResponse): SajuReadings {
  return {
    lifeFortune: { title: 'Life Fortune', icon: 'LF', ...gemini.lifeFortune },
    yearFortune: { title: '2026 Fortune', icon: '26', ...gemini.yearFortune },
    career: { title: 'Career Reading', icon: 'CR', ...gemini.career },
    love: { title: 'Love Reading', icon: 'LV', ...gemini.love },
    health: { title: 'Wellness Reading', icon: 'WL', ...gemini.health },
    wealth: { title: 'Money Patterns', icon: 'MP', ...gemini.wealth },
  };
}
