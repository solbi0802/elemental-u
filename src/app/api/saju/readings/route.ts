import { NextRequest, NextResponse } from 'next/server';
import { generateReadings } from '@/lib/gemini/client';
import type { SajuResult, SajuReadings } from '@/lib/saju/types';

/* Slow endpoint — Gemini call (~5-15s). Returns readings, or null on failure. */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { name?: string; result?: SajuResult };
    const { name, result } = body;

    if (!result) {
      return NextResponse.json({ error: 'result is required' }, { status: 400 });
    }

    try {
      const gemini = await generateReadings(name || 'Friend', result);
      const readings: SajuReadings = {
        lifeFortune: { title: 'Life Fortune', icon: '📜', ...gemini.lifeFortune },
        yearFortune: { title: '2026 Fortune', icon: '🐍', ...gemini.yearFortune },
        career: { title: 'Career Reading', icon: '💼', ...gemini.career },
        love: { title: 'Love Reading', icon: '💕', ...gemini.love },
        health: { title: 'Health Reading', icon: '🏥', ...gemini.health },
        wealth: { title: 'Wealth Reading', icon: '💰', ...gemini.wealth },
      };
      return NextResponse.json({ readings });
    } catch {
      return NextResponse.json({
        readings: null,
        error: 'Reading generation temporarily unavailable',
      });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
