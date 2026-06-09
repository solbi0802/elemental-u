import type { Element, SajuResult } from './types';

export interface KnowledgeEntry {
  id: string;
  topics: Element[];
  title: string;
  principle: string;
  sourceLabel: string;
}

/*
 * Pilot notes only. Replace or expand these entries with summaries from
 * books the project owns or is permitted to use.
 */
export const SAJU_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'pilot-day-master',
    topics: ['wood', 'fire', 'earth', 'metal', 'water'],
    title: 'Begin with the Day Master',
    principle:
      'Treat the Day Master as the interpretive center, then describe how the surrounding elemental balance supports, drains, controls, or strengthens it.',
    sourceLabel: 'Elemental-U pilot methodology note',
  },
  {
    id: 'pilot-balance',
    topics: ['wood', 'fire', 'earth', 'metal', 'water'],
    title: 'Read balance before labels',
    principle:
      'An element is not inherently good or bad. Interpret excess and deficiency as context-dependent tendencies and avoid deterministic claims.',
    sourceLabel: 'Elemental-U pilot methodology note',
  },
  {
    id: 'pilot-wood',
    topics: ['wood'],
    title: 'Wood as growth and direction',
    principle:
      'Wood symbolism emphasizes growth, planning, flexibility, and directed expansion. Too much can appear as overextension; too little as difficulty initiating.',
    sourceLabel: 'Elemental-U pilot element note',
  },
  {
    id: 'pilot-fire',
    topics: ['fire'],
    title: 'Fire as expression and visibility',
    principle:
      'Fire symbolism emphasizes expression, warmth, visibility, and rapid activation. Too much can become impulsive; too little can appear as muted confidence.',
    sourceLabel: 'Elemental-U pilot element note',
  },
  {
    id: 'pilot-earth',
    topics: ['earth'],
    title: 'Earth as stability and mediation',
    principle:
      'Earth symbolism emphasizes stability, care, integration, and practical follow-through. Too much can become inertia; too little can reduce consistency.',
    sourceLabel: 'Elemental-U pilot element note',
  },
  {
    id: 'pilot-metal',
    topics: ['metal'],
    title: 'Metal as structure and discernment',
    principle:
      'Metal symbolism emphasizes standards, boundaries, precision, and decision-making. Too much can become rigidity; too little can weaken prioritization.',
    sourceLabel: 'Elemental-U pilot element note',
  },
  {
    id: 'pilot-water',
    topics: ['water'],
    title: 'Water as reflection and adaptation',
    principle:
      'Water symbolism emphasizes reflection, intuition, communication, and adaptation. Too much can diffuse focus; too little can make change harder.',
    sourceLabel: 'Elemental-U pilot element note',
  },
];

export function retrieveKnowledge(
  result: SajuResult,
  limit = 4,
): KnowledgeEntry[] {
  const priorities = new Set<Element>([
    result.dayMaster,
    result.dominantElement,
  ]);

  const score = (entry: KnowledgeEntry) =>
    entry.topics.reduce(
      (total, topic) => total + (priorities.has(topic) ? 2 : 0),
      entry.id === 'pilot-day-master' ? 3 : 0,
    );

  return [...SAJU_KNOWLEDGE]
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit);
}

export function formatKnowledgeContext(entries: KnowledgeEntry[]): string {
  return entries
    .map(
      (entry) =>
        `[${entry.id}] ${entry.title}\nPrinciple: ${entry.principle}\nSource: ${entry.sourceLabel}`,
    )
    .join('\n\n');
}
