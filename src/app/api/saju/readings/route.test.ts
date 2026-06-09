import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { generateReadings } from '@/lib/gemini/client';
import { clearRateLimitsForTests } from '@/lib/rateLimit';
import { POST } from './route';

vi.mock('@/lib/gemini/client', () => ({
  generateReadings: vi.fn(),
}));

const section = {
  content: 'A sufficiently detailed reflective interpretation for this section.',
  keyInsight: 'A clear and useful takeaway.',
};

const completeReading = {
  lifeFortune: section,
  yearFortune: section,
  career: section,
  love: section,
  health: section,
  wealth: section,
};

function request(
  body: unknown,
  options: {
    ip?: string;
    origin?: string;
    rawBody?: string;
  } = {},
) {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    origin: options.origin ?? 'http://localhost:3000',
  };
  if (options.ip !== '') {
    headers['x-forwarded-for'] = options.ip ?? '203.0.113.1';
  }

  return new NextRequest('http://localhost:3000/api/saju/readings', {
    method: 'POST',
    headers,
    body: options.rawBody ?? JSON.stringify(body),
  });
}

describe('POST /api/saju/readings', () => {
  beforeEach(() => {
    clearRateLimitsForTests();
    process.env.GEMINI_API_KEY = 'test-key';
    vi.mocked(generateReadings).mockResolvedValue(completeReading);
  });

  it('returns a complete free reading', async () => {
    const response = await POST(
      request({
        name: 'Test User',
        birthDate: '1990-05-15',
        birthTime: null,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(Object.keys(body.readings)).toHaveLength(6);
  });

  it('rejects invalid dates', async () => {
    const response = await POST(
      request({
        name: 'Test User',
        birthDate: '2026-02-30',
        birthTime: null,
      }),
    );

    expect(response.status).toBe(400);
  });

  it('rate limits repeated requests by client address', async () => {
    const body = {
      name: 'Test User',
      birthDate: '1990-05-15',
      birthTime: null,
    };

    await POST(request(body));
    await POST(request(body));
    await POST(request(body));
    const response = await POST(request(body));

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBeTruthy();
  });

  it('rejects requests from another origin', async () => {
    const response = await POST(
      request(
        {
          name: 'Test User',
          birthDate: '1990-05-15',
          birthTime: null,
        },
        { origin: 'https://attacker.example' },
      ),
    );

    expect(response.status).toBe(403);
  });

  it('rejects oversized bodies even without a content-length header', async () => {
    const response = await POST(
      request(null, { rawBody: JSON.stringify({ padding: 'x'.repeat(3_000) }) }),
    );

    expect(response.status).toBe(413);
  });

  it('rejects requests without a client address', async () => {
    const response = await POST(
      request(
        {
          name: 'Test User',
          birthDate: '1990-05-15',
          birthTime: null,
        },
        { ip: '' },
      ),
    );

    expect(response.status).toBe(400);
  });

  it('fails cleanly when Gemini generation fails', async () => {
    vi.mocked(generateReadings).mockRejectedValueOnce(new Error('provider error'));

    const response = await POST(
      request({
        name: 'Test User',
        birthDate: '1990-05-15',
        birthTime: null,
      }),
    );

    expect(response.status).toBe(502);
  });
});
