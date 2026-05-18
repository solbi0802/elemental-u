import { describe, it, expect } from 'vitest';
import { calculateFourPillars, calculateElementBalance, calculateSaju } from './calculator';

describe('calculateFourPillars', () => {
  it('calculates year pillar correctly for 1994-03-15', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    expect(pillars.year.stem).toBe('갑');
    expect(pillars.year.branch).toBe('술');
    expect(pillars.year.stemElement).toBe('wood');
  });

  it('calculates month pillar correctly for March (묘월)', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    expect(pillars.month.branch).toBe('묘');
  });

  it('calculates day pillar based on reference date', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    expect(pillars.day.stem).toBeDefined();
    expect(pillars.day.branch).toBeDefined();
  });

  it('returns null hour pillar when no birth time', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    expect(pillars.hour).toBeNull();
  });

  it('calculates hour pillar when birth time provided', () => {
    const pillars = calculateFourPillars(1994, 3, 15, '14:30');
    expect(pillars.hour).not.toBeNull();
    expect(pillars.hour!.branch).toBe('미');
  });
});

describe('calculateElementBalance', () => {
  it('returns percentages that sum to 100', () => {
    const pillars = calculateFourPillars(1994, 3, 15, null);
    const balance = calculateElementBalance(pillars);
    const sum = balance.wood + balance.fire + balance.earth + balance.metal + balance.water;
    expect(Math.round(sum)).toBe(100);
  });

  it('has no negative values', () => {
    const pillars = calculateFourPillars(1994, 3, 15, '14:30');
    const balance = calculateElementBalance(pillars);
    expect(balance.wood).toBeGreaterThanOrEqual(0);
    expect(balance.fire).toBeGreaterThanOrEqual(0);
    expect(balance.earth).toBeGreaterThanOrEqual(0);
    expect(balance.metal).toBeGreaterThanOrEqual(0);
    expect(balance.water).toBeGreaterThanOrEqual(0);
  });
});

describe('calculateSaju', () => {
  it('returns complete SajuResult', () => {
    const result = calculateSaju(1994, 3, 15, '14:30');
    expect(result.fourPillars).toBeDefined();
    expect(result.elementBalance).toBeDefined();
    expect(result.dayMaster).toBeDefined();
    expect(result.dominantElement).toBeDefined();
  });

  it('identifies the dominant element correctly', () => {
    const result = calculateSaju(1994, 3, 15, null);
    const balance = result.elementBalance;
    const maxElement = (Object.entries(balance) as [string, number][])
      .sort((a, b) => b[1] - a[1])[0][0];
    expect(result.dominantElement).toBe(maxElement);
  });
});
