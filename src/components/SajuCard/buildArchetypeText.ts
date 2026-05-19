import type { Element } from '@/lib/saju/types';
import { ELEMENT_META } from '@/lib/saju/types';

/* Single source of truth for the personalized two-sentence archetype line
   that the ElementTeaser shows in-page and the SajuCard prints onto the
   shareable PNG. Pure function — same inputs always yield the same string,
   no Gemini call, no side effects. */
export function buildArchetypeText(
  dominantElement: Element,
  dayMaster: Element,
): string {
  const dom = ELEMENT_META[dominantElement];
  const day = ELEMENT_META[dayMaster];
  const traits = dom.traits
    .slice(0, 3)
    .map((t) => t.toLowerCase())
    .join(', ');
  return (
    `Born of ${dom.label} and grounded in ${day.label}, you channel ` +
    `${traits} energy. Your ${day.label} day master shapes how this ` +
    `${dom.label.toLowerCase()} moves through the world.`
  );
}

/* Short headline counterpart — used by the teaser <h2> and the card hero. */
export function buildArchetypeHeadline(dominantElement: Element): {
  prefix: string;
  archetype: string;
} {
  return {
    prefix: 'You walk the path of',
    archetype: ELEMENT_META[dominantElement].archetype,
  };
}
