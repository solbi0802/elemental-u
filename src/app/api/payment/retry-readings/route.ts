import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { findBySessionToken, updateReadings } from '@/lib/db/purchases';
import { generateReadings } from '@/lib/gemini/client';
import type { SajuReadings } from '@/lib/saju/types';

export const runtime = 'nodejs';

interface GeminiReadingPart {
  content: string;
  keyInsight: string;
}

function shapeReadings(gemini: {
  lifeFortune: GeminiReadingPart;
  yearFortune: GeminiReadingPart;
  career: GeminiReadingPart;
  love: GeminiReadingPart;
  health: GeminiReadingPart;
  wealth: GeminiReadingPart;
}): SajuReadings {
  return {
    lifeFortune: { title: 'Life Fortune', icon: '📜', ...gemini.lifeFortune },
    yearFortune: { title: '2026 Fortune', icon: '🐍', ...gemini.yearFortune },
    career: { title: 'Career Reading', icon: '💼', ...gemini.career },
    love: { title: 'Love Reading', icon: '💕', ...gemini.love },
    health: { title: 'Health Reading', icon: '🏥', ...gemini.health },
    wealth: { title: 'Wealth Reading', icon: '💰', ...gemini.wealth },
  };
}

/* Retry endpoint for the "Gemini failed after a successful charge" case.
   Only valid for rows that have ls_order_id set — proves they paid — so an
   attacker can't use this to trigger Gemini calls for free. */

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { session_token?: string }
    | null;
  const sessionToken = body?.session_token;
  if (!sessionToken) {
    return NextResponse.json({ error: 'session_token is required' }, { status: 400 });
  }

  const purchase = await findBySessionToken(sessionToken);
  if (!purchase) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  /* Gate: ls_order_id must exist (i.e. webhook already validated payment).
     This blocks unpaid sessions from running Gemini via retry. */
  if (!purchase.ls_order_id) {
    return NextResponse.json({ error: 'Payment not confirmed' }, { status: 403 });
  }

  /* If readings already exist, no point regenerating. */
  if (purchase.readings) {
    return NextResponse.json({ already_completed: true });
  }

  /* Same after() pattern as the webhook — keep handler under 10 s. */
  after(async () => {
    try {
      const gemini = await generateReadings(purchase.name || 'Friend', purchase.saju_result);
      const readings = shapeReadings(gemini);
      await updateReadings({ sessionToken, readings });
    } catch (err) {
      console.error('Retry Gemini generation failed', err);
      // Row stays as-is (status='failed', readings=null) so the UI keeps
      // offering retry.
    }
  });

  return NextResponse.json({ accepted: true });
}
