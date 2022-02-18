const {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} = require('../../../business/entities/EntityConstants');

exports.getJudgeFilterForOpinionSearch = ({ documentMustQuery, judgeName }) => {
  documentMustQuery.push({
    bool: {
      should: [
        {
          match: {
            [`${OPINION_JUDGE_FIELD}.S`]: judgeName,
          },
        },
        {
          match: {
            [`${ORDER_JUDGE_FIELD}.S`]: {
              operator: 'and',
              query: judgeName,
            },
          },
        },
      ],
    },
  });
};
