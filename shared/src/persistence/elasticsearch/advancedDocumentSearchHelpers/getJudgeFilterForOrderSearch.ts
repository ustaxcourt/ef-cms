import { ORDER_JUDGE_FIELD } from '../../../business/entities/EntityConstants';

export const getJudgeFilterForOrderSearch = ({ judgeName }) => {
  return {
    bool: {
      should: {
        match: {
          [`${ORDER_JUDGE_FIELD}.S`]: {
            operator: 'and',
            query: judgeName,
          },
        },
      },
    },
  };
};
