import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { generateReadings } from '@/lib/gemini/client';
import { shapeReadings } from '@/lib/gemini/shapeReadings';
import { readingRequestSchema } from '@/lib/saju/readingRequest';
import { consumeReadingRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 2_048;
const RATE_LIMIT = {
  limit: 3,
  windowMs: 60 * 60 * 1000,
};

function clientAddress(request: NextRequest): string | null {
  const header =
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip');
  return header?.split(',')[0]?.trim() || null;
}

function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV !== 'production';
  return origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Invalid request origin' }, { status: 403 });
  }

  const address = clientAddress(request);
  if (!address) {
    return NextResponse.json(
      { error: 'Unable to identify the requesting client' },
      { status: 400 },
    );
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body is too large' }, { status: 413 });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = readingRequestSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Name, birth date, or birth time is invalid' },
      { status: 400 },
    );
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'The reading service is not configured' },
      { status: 503 },
    );
  }

  let rateLimit;
  try {
    rateLimit = await consumeReadingRateLimit(address, RATE_LIMIT);
  } catch (error) {
    console.error('Reading rate limit unavailable', error);
    return NextResponse.json(
      { error: 'The reading service is temporarily unavailable' },
      { status: 503 },
    );
  }

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many reading requests. Please try again later.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(rateLimit.retryAfterSeconds),
          'X-RateLimit-Remaining': '0',
        },
      },
    );
  }

  const { name, birthDate, birthTime } = parsed.data;
  const [year, month, day] = birthDate.split('-').map(Number);
  const result = calculateSaju(year, month, day, birthTime ?? null);

  try {
    const generated = await generateReadings(name, result);
    return NextResponse.json(
      {
        result,
        readings: shapeReadings(generated),
      },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      },
    );
  } catch (error) {
    console.error('Free reading generation failed', error);
    return NextResponse.json(
      { error: 'The reading could not be generated. Please try again.' },
      { status: 502 },
    );
  }
}
