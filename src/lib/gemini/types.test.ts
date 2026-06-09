import { describe, expect, it } from 'vitest';
import { geminiReadingResponseSchema } from './types';

const section = {
  content: 'A sufficiently detailed reflective interpretation for this section.',
  keyInsight: 'A clear and useful takeaway.',
};

describe('geminiReadingResponseSchema', () => {
  it('requires all six complete reading sections', () => {
    expect(
      geminiReadingResponseSchema.safeParse({
        lifeFortune: section,
        yearFortune: section,
        career: section,
        love: section,
        health: section,
        wealth: section,
      }).success,
    ).toBe(true);

    expect(
      geminiReadingResponseSchema.safeParse({
        lifeFortune: section,
      }).success,
    ).toBe(false);
  });
});
