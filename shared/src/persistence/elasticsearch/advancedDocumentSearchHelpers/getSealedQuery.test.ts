import { getSealedQuery } from './getSealedQuery';

describe('getSealedQuery', () => {
  it('returns a query for cases where they either must have "isSealed: false" OR the isSealed field should not exist', () => {
    const result = getSealedQuery();

    expect(result.sealedCaseQuery).toEqual({
      bool: {
        must: [
          {
            bool: {
              minimum_should_match: 1,
              should: [
                {
                  bool: {
                    must: {
                      term: { 'isSealed.BOOL': false },
                    },
                  },
                },
                {
                  bool: {
                    must_not: {
                      exists: { field: 'isSealed' },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });

  it('returns a query for docket entries to not be sealed AND not sealed to "External"', () => {
    const result = getSealedQuery();

    expect(result.sealedDocumentMustNotQuery).toEqual([
      { term: { 'isSealed.BOOL': true } },
      { term: { 'sealedTo.S': 'External' } },
    ]);
  });
});
