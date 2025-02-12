import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import { JudgeActivityReportSearch } from '@shared/business/entities/judgeActivityReport/JudgeActivityReportSearch';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesClosedCountByJudge } from '@web-api/persistence/postgres/cases/reports/getCasesClosedCountByJudge';

export type CasesClosedReturnType = {
  aggregations: {
    [CASE_STATUS_TYPES.closed]: number;
    [CASE_STATUS_TYPES.closedDismissed]: number;
  };
  total: number;
};

export const getCasesClosedByJudgeInteractor = async (
  params: JudgeActivityStatisticsRequest,
  authorizedUser: UnknownAuthUser,
): Promise<CasesClosedReturnType> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(params);

  if (!searchEntity.isValid()) {
    throw new InvalidRequest('Invalid search terms');
  }

  return await getCasesClosedCountByJudge({
    endDate: searchEntity.endDate,
    judges: searchEntity.judges,
    startDate: searchEntity.startDate,
  });
};
