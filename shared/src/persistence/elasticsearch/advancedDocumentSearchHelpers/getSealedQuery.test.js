import { getSealedQuery } from './getSealedQuery';

describe('getSealedQuery', () => {
  it('searches for a case that either must be isSealed: false OR isSealed field should not exist', async () => {
    let mockCaseQueryParams = {
      has_parent: { query: { bool: { filter: [] } } },
    };
    let mockDocketEntryMustNot = [];

    getSealedQuery({
      caseQueryParams: mockCaseQueryParams,
      docketEntryMustNot: mockDocketEntryMustNot,
    });

    expect(mockCaseQueryParams.has_parent.query.bool.filter).toEqual([
      {
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
      },
    ]);
  });

  it('searches for docket entries that are not sealed AND not sealed to "External"', async () => {
    let mockCaseQueryParams = {
      has_parent: { query: { bool: { filter: [] } } },
    };
    let mockDocketEntryMustNot = [];

    await getSealedQuery({
      caseQueryParams: mockCaseQueryParams,
      docketEntryMustNot: mockDocketEntryMustNot,
    });

    expect(mockDocketEntryMustNot).toEqual([
      { term: { 'isSealed.BOOL': true } },
      { term: { 'sealedTo.S': 'External' } },
    ]);
  });
});
