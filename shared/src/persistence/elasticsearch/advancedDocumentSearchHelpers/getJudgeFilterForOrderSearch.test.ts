import { ORDER_JUDGE_FIELD } from '../../../business/entities/EntityConstants';
import { getJudgeFilterForOrderSearch } from './getJudgeFilterForOrderSearch';

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
