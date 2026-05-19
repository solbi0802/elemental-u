'use client';

import { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import * as s from '../[session_token]/CardActions.css';

interface Props {
  /* Ref points at the unscaled 1080×1080 .cardScale element. The preview
     page renders that element with transform: scale(0.5) for display; the
     capture path overrides transform back to none so the exported PNG is
     full-size. */
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
      /* Override the display-time scale so the captured PNG is native size,
         not the half-scale shown on the page. */
      transform: 'none',
      width: `${TARGET_SIZE}px`,
      height: `${TARGET_SIZE}px`,
    },
  });
  const res = await fetch(dataUrl);
  return res.blob();
}

export function PreviewActions({ cardRef, cardName }: Props) {
  const [busy, setBusy] = useState<'save' | 'share' | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  /* Use a guard so a leftover setTimeout doesn't fire on an unmounted
     component after navigation. */
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

  const fileName = `elemental-u-${cardName.toLowerCase().replace(/\s+/g, '-') || 'saju'}.png`;

  async function handleSave() {
    if (!cardRef.current || busy) return;
    setBusy('save');
    try {
      const blob = await capturePng(cardRef.current);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Card capture failed:', err);
      flashFeedback('Save failed — try again');
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

      /* Preferred path: attach the PNG file to the native share sheet so
         the receiving app (Instagram, Kakao, Messages) gets the image
         directly instead of just a link. */
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share({
            files: [file],
            title: `${cardName}'s Saju Reading`,
          });
          return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') return; // user cancelled
          /* fall through to clipboard */
        }
      }

      /* Desktop / unsupported fallback: copy the page URL so the user can
         paste it somewhere. The PNG itself is reachable via Save. */
      if (typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(window.location.href);
        flashFeedback('Link copied');
        return;
      }
      flashFeedback('Use Save instead');
    } catch (err) {
      console.error('Share failed:', err);
      flashFeedback('Share failed — try Save');
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
        {busy === 'share' ? 'Preparing…' : feedback ?? 'Share'}
      </button>
    </div>
  );
}
