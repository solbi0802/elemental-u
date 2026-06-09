import { describe, expect, it } from 'vitest';
import { readingRequestSchema } from './readingRequest';

describe('readingRequestSchema', () => {
  it('accepts valid reading input', () => {
    expect(
      readingRequestSchema.safeParse({
        name: 'Test User',
        birthDate: '1990-05-15',
        birthTime: '10:30',
      }).success,
    ).toBe(true);
  });

  it.each([
    ['impossible date', { name: 'Test', birthDate: '2026-02-30', birthTime: null }],
    ['future date', { name: 'Test', birthDate: '2999-01-01', birthTime: null }],
    ['invalid time', { name: 'Test', birthDate: '1990-05-15', birthTime: '25:00' }],
    ['long name', { name: 'x'.repeat(81), birthDate: '1990-05-15', birthTime: null }],
  ])('rejects %s', (_label, input) => {
    expect(readingRequestSchema.safeParse(input).success).toBe(false);
  });
});
