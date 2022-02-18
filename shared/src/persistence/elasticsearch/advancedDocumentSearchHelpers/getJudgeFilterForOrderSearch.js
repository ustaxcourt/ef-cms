const {
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

exports.getJudgeFilterForOrderSearch = ({ documentMust, judgeName }) => {
  documentMust.push({
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
