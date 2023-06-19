import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportRequestType } from '@web-client/presenter/judgeActivityReportState';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

export const getCasesClosedByJudgeInteractor = async (
  applicationContext,
  { endDate, judgesSelection, startDate }: JudgeActivityReportRequestType,
) => {
  const authorizedUser = await applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgesSelection,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  let totalCloseCaseCount: number = 0;
  let totalClosedDismissedCaseCount: number = 0;

  await Promise.all(
    judgesSelection.map(async judge => {
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
    }),
  );

  return {
    [CASE_STATUS_TYPES.closed]: totalCloseCaseCount,
    [CASE_STATUS_TYPES.closedDismissed]: totalClosedDismissedCaseCount,
  };
};
