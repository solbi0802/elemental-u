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

  /* Save → captures the rendered card DOM to PNG and downloads it locally. */
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

  /* Share → shares the page URL through the native share sheet. No file
     attachment — the user can download with Save separately. On desktop or
     unsupported browsers, falls back to copying the URL to the clipboard. */
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
        {busy === 'share' ? 'Sharing…' : feedback ?? 'Share link'}
      </button>
    </div>
  );
}
