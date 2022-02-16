const {
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

export const getJudgeFilterForOrderSearch = ({
  docketEntryQueryParams,
  judgeName,
}) => {
  docketEntryQueryParams.push({
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
  });
};
