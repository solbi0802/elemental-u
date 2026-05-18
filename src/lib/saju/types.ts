export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

export type HeavenlyStem =
  | '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';

export type EarthlyBranch =
  | '자' | '축' | '인' | '묘' | '진' | '사'
  | '오' | '미' | '신' | '유' | '술' | '해';

export interface Pillar {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
  stemElement: Element;
  branchElement: Element;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
}

export interface ElementBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface SajuResult {
  fourPillars: FourPillars;
  elementBalance: ElementBalance;
  dayMaster: Element;
  dominantElement: Element;
}

export interface ReadingSection {
  title: string;
  icon: string;
  content: string;
  keyInsight: string;
}

export interface SajuReadings {
  lifeFortune: ReadingSection;
  yearFortune: ReadingSection;
  career: ReadingSection;
  love: ReadingSection;
  health: ReadingSection;
  wealth: ReadingSection;
}

export interface SajuApiResponse {
  result: SajuResult;
  readings: SajuReadings;
}

export interface SajuApiRequest {
  name: string;
  birthDate: string;
  birthTime: string | null;
}

// 오방색 — tuned for deep jade canvas (raised saturation so each element reads clearly against dark green)
export const ELEMENT_META: Record<Element, { emoji: string; label: string; color: string; archetype: string; traits: string[] }> = {
  wood:  { emoji: '🌲', label: 'Wood',  color: '#3aa15c', archetype: 'The Creator',    traits: ['Creative', 'Patient', 'Resilient', 'Visionary'] },
  fire:  { emoji: '🔥', label: 'Fire',  color: '#f15b46', archetype: 'The Warrior',    traits: ['Passionate', 'Bold', 'Charismatic', 'Dynamic'] },
  earth: { emoji: '⛰️', label: 'Earth', color: '#f0c860', archetype: 'The Guardian',   traits: ['Reliable', 'Nurturing', 'Grounded', 'Loyal'] },
  metal: { emoji: '⚔️', label: 'Metal', color: '#c8c8e0', archetype: 'The Strategist', traits: ['Decisive', 'Focused', 'Disciplined', 'Ambitious'] },
  water: { emoji: '🌊', label: 'Water', color: '#5a9ce8', archetype: 'The Sage',       traits: ['Wise', 'Adaptable', 'Intuitive', 'Empathetic'] },
};
