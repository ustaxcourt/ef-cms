const {
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

exports.getJudgeFilterForOrderSearch = ({ documentMustQuery, judgeName }) => {
  documentMustQuery.push({
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
