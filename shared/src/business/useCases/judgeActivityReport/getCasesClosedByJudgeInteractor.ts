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

  return await applicationContext
    .getPersistenceGateway()
    .getCasesClosedCountByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judges: searchEntity.judges,
      startDate: searchEntity.startDate,
    });
};
