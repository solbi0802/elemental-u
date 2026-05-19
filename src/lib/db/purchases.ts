import type { SajuResult, SajuReadings } from '@/lib/saju/types';
import { getDb } from './client';

export type PurchaseStatus = 'pending' | 'paid' | 'failed';

export interface Purchase {
  id: string;
  session_token: string;
  name: string | null;
  birth_date: string;
  birth_time: string | null;
  saju_result: SajuResult;
  readings: SajuReadings | null;
  status: PurchaseStatus;
  ls_order_id: string | null;
  paid_amount: number | null;
  paid_currency: string | null;
  created_at: string;
  paid_at: string | null;
}

const TABLE = 'purchases';

export async function insertPendingPurchase(input: {
  name: string | null;
  birthDate: string;
  birthTime: string | null;
  sajuResult: SajuResult;
}): Promise<Pick<Purchase, 'id' | 'session_token'>> {
  const { data, error } = await getDb()
    .from(TABLE)
    .insert({
      name: input.name,
      birth_date: input.birthDate,
      birth_time: input.birthTime,
      saju_result: input.sajuResult,
      status: 'pending',
    })
    .select('id, session_token')
    .single();

  if (error || !data) {
    throw new Error(`Failed to insert pending purchase: ${error?.message ?? 'unknown'}`);
  }
  return data;
}

export async function findBySessionToken(sessionToken: string): Promise<Purchase | null> {
  const { data, error } = await getDb()
    .from(TABLE)
    .select('*')
    .eq('session_token', sessionToken)
    .maybeSingle();
  if (error) throw new Error(`findBySessionToken failed: ${error.message}`);
  return data as Purchase | null;
}

export async function markPaidWithReadings(input: {
  sessionToken: string;
  lsOrderId: string;
  paidAmount: number;
  paidCurrency: string;
  readings: SajuReadings;
}): Promise<void> {
  const { error } = await getDb()
    .from(TABLE)
    .update({
      readings: input.readings,
      status: 'paid' satisfies PurchaseStatus,
      ls_order_id: input.lsOrderId,
      paid_amount: input.paidAmount,
      paid_currency: input.paidCurrency,
      paid_at: new Date().toISOString(),
    })
    .eq('session_token', input.sessionToken);
  if (error) throw new Error(`markPaidWithReadings failed: ${error.message}`);
}

/* Used when the LS webhook arrives but Gemini generation fails. The purchase
   is recorded as paid (the customer was charged) but readings are absent so
   the UI shows the "Try again" path. */
export async function markPaidWithoutReadings(input: {
  sessionToken: string;
  lsOrderId: string;
  paidAmount: number;
  paidCurrency: string;
}): Promise<void> {
  const { error } = await getDb()
    .from(TABLE)
    .update({
      status: 'failed' satisfies PurchaseStatus,
      ls_order_id: input.lsOrderId,
      paid_amount: input.paidAmount,
      paid_currency: input.paidCurrency,
      paid_at: new Date().toISOString(),
    })
    .eq('session_token', input.sessionToken);
  if (error) throw new Error(`markPaidWithoutReadings failed: ${error.message}`);
}

export async function updateReadings(input: {
  sessionToken: string;
  readings: SajuReadings;
}): Promise<void> {
  const { error } = await getDb()
    .from(TABLE)
    .update({
      readings: input.readings,
      status: 'paid' satisfies PurchaseStatus,
    })
    .eq('session_token', input.sessionToken);
  if (error) throw new Error(`updateReadings failed: ${error.message}`);
}
