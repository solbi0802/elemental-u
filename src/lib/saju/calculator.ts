import type { FourPillars, Pillar, ElementBalance, Element, SajuResult } from './types';
import {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  STEM_TO_ELEMENT,
  BRANCH_TO_ELEMENT,
  MONTH_STEM_START,
  HOUR_TO_BRANCH_INDEX,
  HOUR_STEM_START,
  REFERENCE_DATE,
  REFERENCE_DAY_INDEX,
  SOLAR_MONTH_STARTS,
} from './constants';

function makePillar(stemIndex: number, branchIndex: number): Pillar {
  const stem = HEAVENLY_STEMS[((stemIndex % 10) + 10) % 10];
  const branch = EARTHLY_BRANCHES[((branchIndex % 12) + 12) % 12];
  return {
    stem,
    branch,
    stemElement: STEM_TO_ELEMENT[stem],
    branchElement: BRANCH_TO_ELEMENT[branch],
  };
}

function getSolarMonth(month: number, day: number): number {
  // Iterate backwards through calendar-sorted array to find the latest matching 절기
  for (let i = SOLAR_MONTH_STARTS.length - 1; i >= 0; i--) {
    const [m, d, solarIdx] = SOLAR_MONTH_STARTS[i];
    if (month > m || (month === m && day >= d)) {
      return solarIdx;
    }
  }
  // Before Jan 6 → 자월 (solar month 10, from previous Dec 7)
  return 10;
}

function getDaysBetween(date1: Date, date2: Date): number {
  const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
}

export function calculateFourPillars(
  year: number,
  month: number,
  day: number,
  time: string | null
): FourPillars {
  // === Year Pillar ===
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }
  const effYearStemIdx = (effectiveYear - 4) % 10;
  const effYearBranchIdx = (effectiveYear - 4) % 12;
  const effectiveYearPillar = makePillar(effYearStemIdx, effYearBranchIdx);

  // === Month Pillar ===
  const solarMonthIdx = getSolarMonth(month, day);
  const monthBranchIdx = (solarMonthIdx + 2) % 12;
  const monthStemStart = MONTH_STEM_START[effYearStemIdx % 5];
  const monthStemIdx = (monthStemStart + solarMonthIdx) % 10;
  const monthPillar = makePillar(monthStemIdx, monthBranchIdx);

  // === Day Pillar ===
  const targetDate = new Date(year, month - 1, day);
  const daysDiff = getDaysBetween(REFERENCE_DATE, targetDate);
  const dayIdx = ((REFERENCE_DAY_INDEX + daysDiff) % 60 + 60) % 60;
  const dayStemIdx = dayIdx % 10;
  const dayBranchIdx = dayIdx % 12;
  const dayPillar = makePillar(dayStemIdx, dayBranchIdx);

  // === Hour Pillar ===
  let hourPillar: Pillar | null = null;
  if (time) {
    const [hourStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const hourBranchIdx = HOUR_TO_BRANCH_INDEX(hour);
    const hourStemStart = HOUR_STEM_START[dayStemIdx % 5];
    const hourStemIdx = (hourStemStart + hourBranchIdx) % 10;
    hourPillar = makePillar(hourStemIdx, hourBranchIdx);
  }

  return {
    year: effectiveYearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
  };
}

export function calculateElementBalance(pillars: FourPillars): ElementBalance {
  const counts: Record<Element, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

  const activePillars = [pillars.year, pillars.month, pillars.day];
  if (pillars.hour) activePillars.push(pillars.hour);

  for (const pillar of activePillars) {
    counts[pillar.stemElement] += 1;
    counts[pillar.branchElement] += 1;
  }

  const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  const balance: ElementBalance = {
    wood: Math.round((counts.wood / total) * 100),
    fire: Math.round((counts.fire / total) * 100),
    earth: Math.round((counts.earth / total) * 100),
    metal: Math.round((counts.metal / total) * 100),
    water: Math.round((counts.water / total) * 100),
  };

  const sum = balance.wood + balance.fire + balance.earth + balance.metal + balance.water;
  if (sum !== 100) {
    const maxKey = (Object.entries(balance) as [Element, number][])
      .sort((a, b) => b[1] - a[1])[0][0];
    balance[maxKey] += 100 - sum;
  }

  return balance;
}

export function calculateSaju(
  year: number,
  month: number,
  day: number,
  time: string | null
): SajuResult {
  const fourPillars = calculateFourPillars(year, month, day, time);
  const elementBalance = calculateElementBalance(fourPillars);
  const dayMaster = fourPillars.day.stemElement;
  const dominantElement = (Object.entries(elementBalance) as [Element, number][])
    .sort((a, b) => b[1] - a[1])[0][0];

  return { fourPillars, elementBalance, dayMaster, dominantElement };
}
