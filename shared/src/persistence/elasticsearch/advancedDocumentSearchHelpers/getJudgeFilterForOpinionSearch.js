import {
  OPINION_JUDGE_FIELD,
  ORDER_JUDGE_FIELD,
} from '../../../business/entities/EntityConstants';
exports.getJudgeFilterForOpinionSearch = ({
  docketEntryQueryParams,
  judgeName,
}) => {
  docketEntryQueryParams.push({
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
