import crypto from 'node:crypto';
import { getDb } from './db/client';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const requests = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
  now = Date.now(),
): RateLimitResult {
  const current = requests.get(key);

  if (!current || current.resetAt <= now) {
    requests.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      allowed: true,
      remaining: options.limit - 1,
      retryAfterSeconds: Math.ceil(options.windowMs / 1000),
    };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: options.limit - current.count,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

export function clearRateLimitsForTests(): void {
  requests.clear();
}

function hasSupabaseConfig(): boolean {
  const url = process.env.SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const validServerKey =
    (key.startsWith('eyJ') && key.length > 100) ||
    key.startsWith('sb_secret_');
  return (
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    validServerKey
  );
}

function hashRateLimitKey(key: string): string {
  const secret = process.env.RATE_LIMIT_SALT || process.env.GEMINI_API_KEY;
  if (!secret) throw new Error('Missing RATE_LIMIT_SALT or GEMINI_API_KEY');
  return crypto.createHmac('sha256', secret).update(key).digest('hex');
}

export async function consumeReadingRateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): Promise<RateLimitResult> {
  if (process.env.NODE_ENV !== 'production') {
    return checkRateLimit(key, options);
  }

  if (!hasSupabaseConfig()) {
    throw new Error('Production rate limiting requires Supabase configuration');
  }

  const { data, error } = await getDb()
    .rpc('consume_reading_rate_limit', {
      p_key: hashRateLimitKey(key),
      p_limit: options.limit,
      p_window_seconds: Math.ceil(options.windowMs / 1000),
    })
    .single();

  if (error || !data) {
    throw new Error(`Distributed rate limit failed: ${error?.message ?? 'unknown'}`);
  }

  const result = data as {
    allowed: boolean;
    remaining: number;
    retry_after_seconds: number;
  };

  return {
    allowed: result.allowed,
    remaining: result.remaining,
    retryAfterSeconds: result.retry_after_seconds,
  };
}
