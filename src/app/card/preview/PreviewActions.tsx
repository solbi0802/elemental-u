'use client';

import { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { trackEvent } from '@/lib/analytics';
import * as s from '../[session_token]/CardActions.css';

interface Props {
  cardRef: React.RefObject<HTMLDivElement | null>;
  cardName: string;
}

const TARGET_SIZE = 1080;

async function capturePng(node: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(node, {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    pixelRatio: 1,
    cacheBust: true,
    style: {
      transform: 'none',
      width: `${TARGET_SIZE}px`,
      height: `${TARGET_SIZE}px`,
    },
  });
  const response = await fetch(dataUrl);
  return response.blob();
}

export function PreviewActions({ cardRef, cardName }: Props) {
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileName = `elemental-u-${cardName.toLowerCase().replace(/\s+/g, '-') || 'saju'}.png`;

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, []);

  function flashFeedback(message: string) {
    setFeedback(message);
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = setTimeout(() => setFeedback(null), 3000);
  }

  async function handleSave() {
    if (!cardRef.current || busy) return;
    setBusy('save');
    try {
      const blob = await capturePng(cardRef.current);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      trackEvent('destiny_card_saved');
    } catch (error) {
      console.error('Card capture failed:', error);
      flashFeedback('Save failed · try again');
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (!cardRef.current || busy) return;
    setBusy('share');
    try {
      const blob = await capturePng(cardRef.current);
      const file = new File([blob], fileName, { type: 'image/png' });

      if (
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: `${cardName}'s Saju Reading · Elemental-U`,
            text: 'My Elemental-U destiny card',
          });
          trackEvent('destiny_card_shared', { method: 'native_file' });
          return;
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
        }
      }

      flashFeedback('Image sharing is unavailable. Use Save as PNG.');
    } catch (error) {
      console.error('Share failed:', error);
      flashFeedback('Share failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className={s.row}>
      <button
        type="button"
        className={s.button}
        onClick={handleSave}
        disabled={busy !== null}
      >
        {busy === 'save' ? 'Saving…' : 'Save as PNG'}
      </button>
      <button
        type="button"
        className={s.button}
        onClick={handleShare}
        disabled={busy !== null}
      >
        {busy === 'share' ? 'Preparing…' : feedback ?? 'Share image'}
      </button>
    </div>
  );
}
