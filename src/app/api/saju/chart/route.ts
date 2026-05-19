import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/calculator';

/* Fast endpoint — pure calculation. Returns immediately (~50ms). */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { birthDate?: string; birthTime?: string | null };
    const { birthDate, birthTime } = body;

    if (!birthDate) {
      return NextResponse.json({ error: 'birthDate is required' }, { status: 400 });
    }

    const [year, month, day] = birthDate.split('-').map(Number);
    const result = calculateSaju(year, month, day, birthTime ?? null);

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
