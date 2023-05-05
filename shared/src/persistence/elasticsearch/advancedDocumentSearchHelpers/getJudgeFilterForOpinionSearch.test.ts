import {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '../../../business/entities/EntityConstants';
import { getJudgeFilterForOpinionSearch } from './getJudgeFilterForOpinionSearch';

describe('getJudgeFilterForOpinionSearch', () => {
  it('does a search for both judge and signed judge since bench opinions are technically orders', () => {
    const expectedOrderJudgeFilter = `${ORDER_JUDGE_FIELD}.S`;
    const expectedOpinionJudgeFilter = `${OPINION_JUDGE_FIELD}.S`;
    const expectedJudgeName = 'Judge Antonia Lofaso';

    const result = getJudgeFilterForOpinionSearch({
      judgeName: expectedJudgeName,
    });

    expect(result).toEqual({
      bool: {
        should: [
          {
            match: {
              [expectedOpinionJudgeFilter]: expectedJudgeName,
            },
          },
          {
            match: {
              [expectedOrderJudgeFilter]: {
                operator: 'and',
                query: expectedJudgeName,
              },
            },
          },
        ],
      },
    });
  });
});
