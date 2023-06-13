import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { sortBy } from 'lodash';

export const getCasesClosedByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
  }: { judgeName: string; endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let listOfJudgesForRequest = [judgeName];
  let totalCloseCaseCount: number = 0;
  let totalClosedDismissedCaseCount: number = 0;

  if (judgeName === 'all') {
    const users = await applicationContext
      .getUseCases()
      .getUsersInSectionInteractor(applicationContext, {
        section: 'judge',
      });

    listOfJudgesForRequest = sortBy(users, 'name');
  }

  listOfJudgesForRequest.forEach(async judge => {
    const searchEntity = new JudgeActivityReportSearch({
      endDate,
      judgeName: judge,
      startDate,
    });

    if (!searchEntity.isValid()) {
      throw new InvalidRequest();
    }

    const casesClosedByJudge = await applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge({
        applicationContext,
        endDate: searchEntity.endDate,
        judgeName: judge,
        startDate: searchEntity.startDate,
      });

    const closedDismissedCaseCount: number = casesClosedByJudge.filter(
      caseItem => caseItem.status === CASE_STATUS_TYPES.closedDismissed,
    ).length;
    totalClosedDismissedCaseCount += closedDismissedCaseCount;

    const closedCaseCount: number = casesClosedByJudge.filter(
      caseItem => caseItem.status === CASE_STATUS_TYPES.closed,
    ).length;
    totalCloseCaseCount += closedCaseCount;
  });

  return {
    [CASE_STATUS_TYPES.closed]: totalCloseCaseCount,
    [CASE_STATUS_TYPES.closedDismissed]: totalClosedDismissedCaseCount,
  };
};
