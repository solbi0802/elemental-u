'use client';

import { useState } from 'react';
import * as s from './CardActions.css';

interface Props {
  sessionToken: string;
  cardName: string;
}

/* Save + Share buttons. The actual save/share targets are filled in once
   the /api/card/[token]/image PNG endpoint exists (next commit). Until
   then the buttons are wired but use the page URL as a placeholder share
   target so the flow can be tested end-to-end visually. */
export function CardActions({ sessionToken, cardName }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/card/${sessionToken}`
      : '';
  const imageUrl = `/api/card/${sessionToken}/image`;
  const downloadFileName = `elemental-u-${cardName.toLowerCase().replace(/\s+/g, '-') || 'saju'}.png`;

  async function handleShare() {
    if (typeof navigator === 'undefined') return;

    /* On mobile, the Web Share API can attach the PNG as a file so the
       receiving app (Instagram, Kakao, Messages) sees the image directly. */
    if (typeof navigator.share === 'function') {
      try {
        const res = await fetch(imageUrl);
        if (res.ok && typeof navigator.canShare === 'function') {
          const blob = await res.blob();
          const file = new File([blob], downloadFileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              url: shareUrl,
              title: `${cardName}'s Saju Reading`,
            });
            return;
          }
        }
        await navigator.share({ url: shareUrl, title: `${cardName}'s Saju Reading` });
        return;
      } catch {
        /* User cancelled or share rejected — fall through to copy. */
      }
    }

    /* Desktop fallback: copy share URL to clipboard. */
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard blocked — nothing to do. */
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
      <button type="button" className={s.button} onClick={handleShare}>
        {copied ? 'Link copied' : 'Share'}
      </button>
    </div>
  );
}
