import { getJudgeFilterForOrderSearch } from './getJudgeFilterForOrderSearch';

describe('getJudgeFilterForOrderSearch', () => {
  it('does a search for signed judge name', () => {
    let mockDocketEntryQueryParams = [];

    getJudgeFilterForOrderSearch({
      docketEntryQueryParams: mockDocketEntryQueryParams,
      judgeName: 'Judge Alex Guarnaschelli',
    });

    expect(mockDocketEntryQueryParams).toEqual([
      {
        bool: {
          should: {
            match: {
              'signedJudgeName.S': {
                operator: 'and',
                query: 'Judge Alex Guarnaschelli',
              },
            },
          },
        },
      },
    ]);
  });
});
