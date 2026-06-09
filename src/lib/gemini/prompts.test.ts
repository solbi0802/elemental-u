import { describe, expect, it } from 'vitest';
import { calculateSaju } from '../saju/calculator';
import { retrieveKnowledge } from '../saju/knowledge';
import { buildUserPrompt } from './prompts';

describe('grounded reading prompt', () => {
  it('injects retrieved knowledge and safety boundaries', () => {
    const result = calculateSaju(1990, 5, 15, null);
    const prompt = buildUserPrompt('Test User', result, retrieveKnowledge(result));

    expect(prompt).toContain('## Knowledge context');
    expect(prompt).toContain('Elemental-U pilot');
    expect(prompt).toContain('avoid diagnosis');
    expect(prompt).toContain('avoid investment recommendations');
  });
});
