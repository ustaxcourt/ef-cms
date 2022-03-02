const {
  getJudgeFilterForOrderSearch,
} = require('./getJudgeFilterForOrderSearch');
const {
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

describe('getJudgeFilterForOrderSearch', () => {
  it('does a search for signed judge name', () => {
    const expectedJudgeFilter = `${ORDER_JUDGE_FIELD}.S`;
    const expectedJudgeName = 'Judge Alex Guarnaschelli';

    const result = getJudgeFilterForOrderSearch({
      judgeName: expectedJudgeName,
    });

    expect(result).toEqual({
      bool: {
        should: {
          match: {
            [expectedJudgeFilter]: {
              operator: 'and',
              query: expectedJudgeName,
            },
          },
        },
      },
    });
  });
});
