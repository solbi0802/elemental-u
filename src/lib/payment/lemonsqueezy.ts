import crypto from 'node:crypto';

/* Plain-fetch Lemon Squeezy client. We only need two surfaces — creating a
   checkout session and verifying the inbound webhook HMAC — so pulling in
   the official SDK isn't worth the bytes. */

const LS_API = 'https://api.lemonsqueezy.com/v1';

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in environment`);
  return v;
}

interface CreateCheckoutInput {
  sessionToken: string;          // forwarded back via webhook custom_data
  email?: string;                // optional prefill (we don't collect it pre-payment)
  redirectUrl: string;           // where LS sends the user after paying
}

interface CheckoutResponse {
  url: string;
}

/* See https://docs.lemonsqueezy.com/api/checkouts/create-checkout */
export async function createCheckout(input: CreateCheckoutInput): Promise<CheckoutResponse> {
  const apiKey = env('LEMONSQUEEZY_API_KEY');
  const storeId = env('LEMONSQUEEZY_STORE_ID');
  const variantId = env('LEMONSQUEEZY_VARIANT_ID');

  const body = {
    data: {
      type: 'checkouts',
      attributes: {
        checkout_data: {
          custom: {
            session_token: input.sessionToken,
          },
          ...(input.email ? { email: input.email } : {}),
        },
        product_options: {
          redirect_url: input.redirectUrl,
        },
      },
      relationships: {
        store: { data: { type: 'stores', id: storeId } },
        variant: { data: { type: 'variants', id: variantId } },
      },
    },
  };

  const res = await fetch(`${LS_API}/checkouts`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Lemon Squeezy createCheckout failed (${res.status}): ${errText}`);
  }

  const json = (await res.json()) as {
    data?: { attributes?: { url?: string } };
  };
  const url = json.data?.attributes?.url;
  if (!url) throw new Error('Lemon Squeezy createCheckout returned no URL');
  return { url };
}

/* See https://docs.lemonsqueezy.com/help/webhooks#signing-requests
   LS signs the raw request body with HMAC-SHA256 using the webhook secret. */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = env('LEMONSQUEEZY_WEBHOOK_SECRET');
  const computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

/* Subset of the LS webhook payload we actually read. The `meta.event_name`
   tells us what happened, and `meta.custom_data.session_token` is the
   identifier we passed into createCheckout. */
export interface LsWebhookPayload {
  meta: {
    event_name: string;
    custom_data?: { session_token?: string };
  };
  data: {
    id: string;            // LS order ID
    type: string;          // 'orders'
    attributes: {
      status: string;      // 'paid', 'pending', etc
      total: number;       // amount in cents
      currency: string;    // e.g. 'USD'
      user_email?: string;
    };
  };
}
