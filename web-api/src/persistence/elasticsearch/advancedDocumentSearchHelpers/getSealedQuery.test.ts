import { getSealedQuery } from './getSealedQuery';

describe('getSealedQuery', () => {
  it('returns a query for docket entries to not be sealed AND not sealed to "External"', () => {
    const result = getSealedQuery();

    expect(result.sealedDocumentMustNotQuery).toEqual([
      { term: { 'isSealed.BOOL': true } },
      { term: { 'sealedTo.S': 'External' } },
    ]);
  });
});
