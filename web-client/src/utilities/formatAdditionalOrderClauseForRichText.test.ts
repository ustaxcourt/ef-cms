import { formatAdditionalOrderClauseForRichText } from './formatAdditionalOrderClauseForRichText';

describe('formatAdditionalOrderClauseForRichText', () => {
  it('returns empty string for whitespace-only input', () => {
    expect(formatAdditionalOrderClauseForRichText('   ')).toBe('');
  });

  it('does not append a period when the clause already ends with a period', () => {
    expect(formatAdditionalOrderClauseForRichText('Full compliance.')).toBe(
      'Full compliance.',
    );
  });

  it('does not append a period when the clause ends with closing quote after punctuation', () => {
    expect(formatAdditionalOrderClauseForRichText('Answer "yes".')).toBe(
      'Answer "yes".',
    );
  });

  it('does not append a period when the clause ends with question mark', () => {
    expect(formatAdditionalOrderClauseForRichText('Proceed?')).toBe('Proceed?');
  });

  it('appends a period when the clause has no terminal punctuation', () => {
    expect(formatAdditionalOrderClauseForRichText('Parties shall comply')).toBe(
      'Parties shall comply.',
    );
  });

  it('trims leading and trailing whitespace before formatting', () => {
    expect(formatAdditionalOrderClauseForRichText('  trim me  ')).toBe(
      'trim me.',
    );
  });
});
