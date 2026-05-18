import type { HeavenlyStem, EarthlyBranch, Element } from './types';

export const HEAVENLY_STEMS: HeavenlyStem[] = [
  '갑', '을', '병', '정', '무', '기', '경', '신', '임', '계',
];

export const EARTHLY_BRANCHES: EarthlyBranch[] = [
  '자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해',
];

export const STEM_TO_ELEMENT: Record<HeavenlyStem, Element> = {
  '갑': 'wood',  '을': 'wood',
  '병': 'fire',  '정': 'fire',
  '무': 'earth', '기': 'earth',
  '경': 'metal', '신': 'metal',
  '임': 'water', '계': 'water',
};

export const BRANCH_TO_ELEMENT: Record<EarthlyBranch, Element> = {
  '인': 'wood',  '묘': 'wood',
  '사': 'fire',  '오': 'fire',
  '진': 'earth', '술': 'earth', '축': 'earth', '미': 'earth',
  '신': 'metal', '유': 'metal',
  '해': 'water', '자': 'water',
};

export const STEM_NAMES: Record<HeavenlyStem, string> = {
  '갑': 'Gap (Yang Wood)',    '을': 'Eul (Yin Wood)',
  '병': 'Byeong (Yang Fire)', '정': 'Jeong (Yin Fire)',
  '무': 'Mu (Yang Earth)',    '기': 'Gi (Yin Earth)',
  '경': 'Gyeong (Yang Metal)','신': 'Sin (Yin Metal)',
  '임': 'Im (Yang Water)',    '계': 'Gye (Yin Water)',
};

export const BRANCH_NAMES: Record<EarthlyBranch, string> = {
  '자': 'Ja (Rat)',    '축': 'Chuk (Ox)',    '인': 'In (Tiger)',
  '묘': 'Myo (Rabbit)','진': 'Jin (Dragon)', '사': 'Sa (Snake)',
  '오': 'O (Horse)',   '미': 'Mi (Goat)',    '신': 'Sin (Monkey)',
  '유': 'Yu (Rooster)','술': 'Sul (Dog)',    '해': 'Hae (Pig)',
};

// 월건 lookup: yearStemIndex (0-4, repeating every 5) -> first month stem index
export const MONTH_STEM_START: number[] = [2, 4, 6, 8, 0];

// 시간 -> 지지 mapping (24h -> 12 branches)
export const HOUR_TO_BRANCH_INDEX: (hour: number) => number = (hour: number) => {
  return Math.floor(((hour + 1) % 24) / 2);
};

// 시두 lookup: dayStemIndex (0-4, repeating every 5) -> first hour stem index
export const HOUR_STEM_START: number[] = [0, 2, 4, 6, 8];

// Reference date for day pillar calculation
// 1900-01-01 was 갑자일 (index 0 in the 60-day cycle)
export const REFERENCE_DATE = new Date(1900, 0, 1);
export const REFERENCE_DAY_INDEX = 0;

// 절기 approximate month boundaries — sorted by calendar month
// Each entry: [calendarMonth, startDay, solarMonthIndex]
// solarMonthIndex: 인월=0, 묘월=1, ..., 축월=11
export const SOLAR_MONTH_STARTS: [number, number, number][] = [
  [1, 6, 11],   // 축월 — Jan 6
  [2, 4, 0],    // 인월 — Feb 4
  [3, 6, 1],    // 묘월 — Mar 6
  [4, 5, 2],    // 진월 — Apr 5
  [5, 6, 3],    // 사월 — May 6
  [6, 6, 4],    // 오월 — Jun 6
  [7, 7, 5],    // 미월 — Jul 7
  [8, 7, 6],    // 신월 — Aug 7
  [9, 8, 7],    // 유월 — Sep 8
  [10, 8, 8],   // 술월 — Oct 8
  [11, 7, 9],   // 해월 — Nov 7
  [12, 7, 10],  // 자월 — Dec 7
];
