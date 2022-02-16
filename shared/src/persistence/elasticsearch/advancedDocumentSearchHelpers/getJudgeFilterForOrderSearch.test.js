const {
  getJudgeFilterForOrderSearch,
} = require('./getJudgeFilterForOrderSearch');

describe('getJudgeFilterForOrderSearch', () => {
  it('does a search for signed judge name', async () => {
    let mockDocketEntryQueryParams = [];

    getJudgeFilterForOrderSearch({
      docketEntryQueryParams: mockDocketEntryQueryParams,
      judgeName: 'Judge Antonia Lofaso',
    });

    expect(mockDocketEntryQueryParams).toEqual([
      {
        bool: {
          should: {
            match: {
              'signedJudgeName.S': {
                operator: 'and',
                query: 'Judge Antonia Lofaso',
              },
            },
          },
        },
      },
    ]);
  });
});
