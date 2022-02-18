const {
  getJudgeFilterForOrderSearch,
} = require('./getJudgeFilterForOrderSearch');

describe('getJudgeFilterForOrderSearch', () => {
  it('does a search for signed judge name', () => {
    let mockDocumentMust = [];

    getJudgeFilterForOrderSearch({
      documentMust: mockDocumentMust,
      judgeName: 'Judge Alex Guarnaschelli',
    });

    expect(mockDocumentMust).toEqual([
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
