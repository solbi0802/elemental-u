'use client';

import { useEffect, useRef, useState } from 'react';
import * as s from './CardActions.css';

interface Props {
  sessionToken: string;
  cardName: string;
}

/* Save downloads the PNG that the /api/card/[token]/image endpoint
   generates server-side. Share publishes the page URL through the native
   share sheet, falling back to clipboard copy on desktop. */
export function CardActions({ sessionToken, cardName }: Props) {
  const [busy, setBusy] = useState<'share' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  function flashFeedback(message: string) {
    setFeedback(message);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 2200);
  }

  const imageUrl = `/api/card/${sessionToken}/image`;
  const downloadFileName = `elemental-u-${cardName.toLowerCase().replace(/\s+/g, '-') || 'saju'}.png`;

  async function handleShare() {
    if (busy) return;
    setBusy('share');
    try {
      const shareUrl = window.location.href;
      const shareTitle = `${cardName}'s Saju Reading · Elemental-U`;

      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        try {
          await navigator.share({ url: shareUrl, title: shareTitle });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return;
          /* fall through to clipboard */
        }
      }

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.clipboard?.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(shareUrl);
        flashFeedback('Link copied');
        return;
      }

      flashFeedback('Share not supported');
    } catch (err) {
      console.error('Share failed:', err);
      flashFeedback('Share failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={s.row}>
      <a
        href={imageUrl}
        download={downloadFileName}
        className={s.button}
      >
        Save as PNG
      </a>
      <button
        type="button"
        className={s.button}
        onClick={handleShare}
        disabled={busy !== null}
      >
        {busy === 'share' ? 'Sharing…' : feedback ?? 'Share link'}
      </button>
    </div>
  );
}
