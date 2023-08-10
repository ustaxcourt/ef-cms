import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  CasesClosedReturnType,
  JudgeActivityReportFilters,
} from '@web-client/presenter/judgeActivityReportState';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '@shared/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getCasesClosedByJudgeInteractor = async (
  applicationContext,
  params: JudgeActivityReportFilters,
): Promise<CasesClosedReturnType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const { aggregations, total } = await applicationContext
    .getPersistenceGateway()
    .getCasesClosedByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judges: searchEntity.judges,
      startDate: searchEntity.startDate,
    });

  const computedAggregatedClosedCases =
    aggregations.closed_cases.buckets.reduce((bucketObj, item) => {
      return {
        ...bucketObj,
        [item.key]: item.doc_count,
      };
    }, {});

  const results = aggregations.closed_cases.buckets.length
    ? computedAggregatedClosedCases
    : {
        [CASE_STATUS_TYPES.closed]: 0,
        [CASE_STATUS_TYPES.closedDismissed]: 0,
      };

  return {
    closedCasesTotal: total,
    results,
  };
};
