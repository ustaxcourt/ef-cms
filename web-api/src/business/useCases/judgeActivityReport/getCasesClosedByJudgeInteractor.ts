import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '../../../../../shared/src/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';

export type CasesClosedReturnType = {
  aggregations: {
    [CASE_STATUS_TYPES.closed]: number;
    [CASE_STATUS_TYPES.closedDismissed]: number;
  };
  total: number;
};

export const getCasesClosedByJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
  params: JudgeActivityStatisticsRequest,
): Promise<CasesClosedReturnType> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  return await applicationContext
    .getPersistenceGateway()
    .getCasesClosedCountByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judges: searchEntity.judges,
      startDate: searchEntity.startDate,
    });
};
