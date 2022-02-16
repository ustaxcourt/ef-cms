const {
  getJudgeFilterForOpinionSearch,
} = require('./getJudgeFilterForOpinionSearch');

describe('getJudgeFilterForOpinionSearch', () => {
  it('does a search for both judge and signed judge since bench opinions are technically orders', async () => {
    let mockDocketEntryQueryParams = [];

    getJudgeFilterForOpinionSearch({
      docketEntryQueryParams: mockDocketEntryQueryParams,
      judgeName: 'Judge Antonia Lofaso',
    });

    expect(mockDocketEntryQueryParams).toEqual([
      {
        bool: {
          should: [
            {
              match: {
                'judge.S': 'Judge Antonia Lofaso',
              },
            },
            {
              match: {
                'signedJudgeName.S': {
                  operator: 'and',
                  query: 'Judge Antonia Lofaso',
                },
              },
            },
          ],
        },
      },
    ]);
  });
});
