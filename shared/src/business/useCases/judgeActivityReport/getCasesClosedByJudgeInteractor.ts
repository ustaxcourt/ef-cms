import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportFilters } from '../../../../../web-client/src/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getCasesClosedByJudgeInteractor = async (
  applicationContext,
  { endDate, judgeName, startDate }: JudgeActivityReportFilters,
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeName,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const judgeNameToQuery =
    searchEntity.judgeName === 'All Judges' ? '' : searchEntity.judgeName;

  const casesClosedByJudge = await applicationContext
    .getPersistenceGateway()
    .getCasesClosedByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judgeName: judgeNameToQuery,
      startDate: searchEntity.startDate,
    });

  const closedDismissedCaseCount = casesClosedByJudge.filter(
    caseItem => caseItem.status === CASE_STATUS_TYPES.closedDismissed,
  ).length;
  const closedCaseCount = casesClosedByJudge.filter(
    caseItem => caseItem.status === CASE_STATUS_TYPES.closed,
  ).length;

  return {
    [CASE_STATUS_TYPES.closed]: closedCaseCount,
    [CASE_STATUS_TYPES.closedDismissed]: closedDismissedCaseCount,
  };
};
