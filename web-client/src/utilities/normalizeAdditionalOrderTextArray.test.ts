import {
  additionalOrderTextArrayWithRequiredFirstField,
  normalizeAdditionalOrderTextArray,
} from './normalizeAdditionalOrderTextArray';

describe('normalizeAdditionalOrderTextArray', () => {
  it('returns an empty array when input is undefined, null, or empty', () => {
    expect(normalizeAdditionalOrderTextArray(undefined)).toEqual([]);
    expect(normalizeAdditionalOrderTextArray(null)).toEqual([]);
    expect(normalizeAdditionalOrderTextArray([])).toEqual([]);
  });

  it('removes empty strings and whitespace-only entries', () => {
    expect(
      normalizeAdditionalOrderTextArray(['', ' ', '\t', '\n', '  \t  ']),
    ).toEqual([]);
  });

  it('keeps entries with non-whitespace content and preserves spacing within the string', () => {
    expect(
      normalizeAdditionalOrderTextArray(['  Parties shall comply.  ', '']),
    ).toEqual(['  Parties shall comply.  ']);
  });
});

describe('additionalOrderTextArrayWithRequiredFirstField', () => {
  it('returns one empty string when there are no meaningful entries', () => {
    expect(additionalOrderTextArrayWithRequiredFirstField([])).toEqual(['']);
  });

  it('returns meaningful entries unchanged', () => {
    expect(
      additionalOrderTextArrayWithRequiredFirstField(['First', 'Second']),
    ).toEqual(['First', 'Second']);
  });
});
