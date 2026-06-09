import { beforeEach, describe, expect, it } from 'vitest';
import { checkRateLimit, clearRateLimitsForTests } from './rateLimit';

describe('checkRateLimit', () => {
  beforeEach(clearRateLimitsForTests);

  it('blocks requests over the configured limit', () => {
    const options = { limit: 2, windowMs: 60_000 };

    expect(checkRateLimit('ip', options, 0).allowed).toBe(true);
    expect(checkRateLimit('ip', options, 1).allowed).toBe(true);
    expect(checkRateLimit('ip', options, 2).allowed).toBe(false);
  });

  it('resets after the window', () => {
    const options = { limit: 1, windowMs: 100 };

    expect(checkRateLimit('ip', options, 0).allowed).toBe(true);
    expect(checkRateLimit('ip', options, 100).allowed).toBe(true);
  });
});
