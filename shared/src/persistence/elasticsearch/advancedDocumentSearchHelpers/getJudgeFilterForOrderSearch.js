const {
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

exports.getJudgeFilterForOrderSearch = ({ judgeName }) => {
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
