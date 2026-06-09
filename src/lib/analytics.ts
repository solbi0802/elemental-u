'use client';

export type AnalyticsEvent =
  | 'chart_requested'
  | 'chart_generated'
  | 'reading_requested'
  | 'reading_generated'
  | 'reading_failed'
  | 'reading_viewed'
  | 'destiny_card_opened'
  | 'destiny_card_saved'
  | 'destiny_card_shared';

type EventProperties = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (eventName: string, options?: { props?: EventProperties }) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEvent,
  properties: EventProperties = {},
): void {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent('elemental-u:analytics', {
      detail: { eventName, properties },
    }),
  );

  window.gtag?.('event', eventName, properties);
  window.plausible?.(eventName, { props: properties });
}
