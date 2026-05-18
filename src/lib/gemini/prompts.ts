import type { SajuResult } from '../saju/types';
import { STEM_NAMES, BRANCH_NAMES } from '../saju/constants';

function pillarToString(pillar: { stem: string; branch: string }): string {
  const stemName = STEM_NAMES[pillar.stem as keyof typeof STEM_NAMES] || pillar.stem;
  const branchName = BRANCH_NAMES[pillar.branch as keyof typeof BRANCH_NAMES] || pillar.branch;
  return `${stemName} + ${branchName}`;
}

export const SYSTEM_PROMPT = `You are a master Korean Saju (四柱) astrologer who explains readings in English for a Western audience. Your tone is mystical yet warm and accessible — like a wise mentor revealing cosmic secrets.

Rules:
- Never use Korean terms without an English explanation
- Write in second person ("You are...", "Your energy...")
- Be specific and personal, not generic horoscope filler
- Each section should be 3-4 paragraphs
- Use vivid metaphors related to the elements (nature, seasons, forces)
- Be encouraging but honest about challenges
- Include actionable advice where appropriate

Output MUST be valid JSON matching this exact structure:
{
  "lifeFortune": { "content": "...", "keyInsight": "..." },
  "yearFortune": { "content": "...", "keyInsight": "..." },
  "career": { "content": "...", "keyInsight": "..." },
  "love": { "content": "...", "keyInsight": "..." },
  "health": { "content": "...", "keyInsight": "..." },
  "wealth": { "content": "...", "keyInsight": "..." }
}

Each "content" should be 3-4 paragraphs of interpretation.
Each "keyInsight" should be 1-2 sentences — the most important takeaway.`;

export function buildUserPrompt(name: string, result: SajuResult): string {
  const { fourPillars, elementBalance, dayMaster, dominantElement } = result;

  let prompt = `Please provide a complete Saju reading for ${name}.

## Four Pillars (사주 원국)
- Year Pillar: ${pillarToString(fourPillars.year)}
- Month Pillar: ${pillarToString(fourPillars.month)}
- Day Pillar: ${pillarToString(fourPillars.day)} (Day Master: ${dayMaster})`;

  if (fourPillars.hour) {
    prompt += `\n- Hour Pillar: ${pillarToString(fourPillars.hour)}`;
  } else {
    prompt += `\n- Hour Pillar: Unknown (birth time not provided)`;
  }

  prompt += `

## Element Balance
- Wood: ${elementBalance.wood}%
- Fire: ${elementBalance.fire}%
- Earth: ${elementBalance.earth}%
- Metal: ${elementBalance.metal}%
- Water: ${elementBalance.water}%
- Dominant Element: ${dominantElement}

## Sections to cover:
1. **Life Fortune (총운)**: Divide into Early Years (teens-20s), Mid Years (30s-50s), Late Years (60s+). What is their overall life trajectory?
2. **2026 Fortune (신년운세)**: The year 2026 is 丙午 (Fire Horse). How does this year's energy interact with their chart? Give quarterly highlights (Q1-Q4).
3. **Career**: What career paths suit their element balance? Work style strengths and timing advice.
4. **Love**: Relationship patterns, compatible element types, and romantic timing.
5. **Health**: Element-based health tendencies, vulnerable areas, and wellness advice.
6. **Wealth**: Financial tendencies, money management style, and wealth opportunities.`;

  return prompt;
}
