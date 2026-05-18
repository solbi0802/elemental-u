import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';
import { generateReadings } from '@/lib/gemini/client';
import type { SajuApiRequest, SajuReadings } from '@/lib/saju/types';

export async function POST(request: NextRequest) {
  try {
    const body: SajuApiRequest = await request.json();
    const { name, birthDate, birthTime } = body;

    if (!birthDate) {
      return NextResponse.json({ error: 'birthDate is required' }, { status: 400 });
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const result = calculateSaju(year, month, day, birthTime);

    let readings: SajuReadings;
    try {
      const geminiResponse = await generateReadings(name || 'Friend', result);
      readings = {
        lifeFortune: {
          title: 'Life Fortune',
          icon: '📜',
          content: geminiResponse.lifeFortune.content,
          keyInsight: geminiResponse.lifeFortune.keyInsight,
        },
        yearFortune: {
          title: '2026 Fortune',
          icon: '🐍',
          content: geminiResponse.yearFortune.content,
          keyInsight: geminiResponse.yearFortune.keyInsight,
        },
        career: {
          title: 'Career Reading',
          icon: '💼',
          content: geminiResponse.career.content,
          keyInsight: geminiResponse.career.keyInsight,
        },
        love: {
          title: 'Love Reading',
          icon: '💕',
          content: geminiResponse.love.content,
          keyInsight: geminiResponse.love.keyInsight,
        },
        health: {
          title: 'Health Reading',
          icon: '🏥',
          content: geminiResponse.health.content,
          keyInsight: geminiResponse.health.keyInsight,
        },
        wealth: {
          title: 'Wealth Reading',
          icon: '💰',
          content: geminiResponse.wealth.content,
          keyInsight: geminiResponse.wealth.keyInsight,
        },
      };
    } catch {
      return NextResponse.json({
        result,
        readings: null,
        error: 'Reading generation temporarily unavailable',
      });
    }

    return NextResponse.json({ result, readings });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
