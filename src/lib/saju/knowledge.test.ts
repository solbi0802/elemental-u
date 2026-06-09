import { describe, expect, it } from 'vitest';
import { formatKnowledgeContext, retrieveKnowledge } from './knowledge';
import { calculateSaju } from './calculator';

describe('saju knowledge retrieval', () => {
  const result = calculateSaju(1990, 5, 15, null);

  it('prioritizes methodology and chart-relevant elements', () => {
    const entries = retrieveKnowledge(result, 4);
    const ids = entries.map((entry) => entry.id);

    expect(ids).toContain('pilot-day-master');
    expect(ids).toContain(`pilot-${result.dayMaster}`);
    expect(ids).toContain(`pilot-${result.dominantElement}`);
  });

  it('keeps source labels in the prompt context', () => {
    const context = formatKnowledgeContext(retrieveKnowledge(result, 2));

    expect(context).toContain('Source:');
    expect(context).toContain('Principle:');
  });
});
