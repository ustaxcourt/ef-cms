const {
  getJudgeFilterForOpinionSearch,
} = require('./getJudgeFilterForOpinionSearch');

describe('getJudgeFilterForOpinionSearch', () => {
  it('does a search for both judge and signed judge since bench opinions are technically orders', () => {
    let mockDocumentMust = [];

    getJudgeFilterForOpinionSearch({
      documentMust: mockDocumentMust,
      judgeName: 'Judge Antonia Lofaso',
    });

    expect(mockDocumentMust).toEqual([
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
