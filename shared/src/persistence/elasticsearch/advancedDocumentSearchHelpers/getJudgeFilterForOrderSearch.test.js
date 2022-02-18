const {
  getJudgeFilterForOrderSearch,
} = require('./getJudgeFilterForOrderSearch');

describe('getJudgeFilterForOrderSearch', () => {
  it('does a search for signed judge name', () => {
    const result = getJudgeFilterForOrderSearch({
      judgeName: 'Judge Alex Guarnaschelli',
    });

    expect(result).toEqual({
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
    });
  });
});
