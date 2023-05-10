import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

/**
 * getCasesClosedByJudgeInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.judgeName the name of the judge
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {array} providers.statuses statuses of cases for judge activity
 * @returns {object} errors (null if no errors)
 */
export const getSubmittedAndCavCasesByJudgeInteractor = async (
  applicationContext,
  {
    endDate,
    judgeName,
    startDate,
    statuses,
  }: {
    judgeName: string;
    endDate: string;
    startDate: string;
    statuses: string[];
  },
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

  const submittedAndCavCasesByJudge = await applicationContext
    .getPersistenceGateway()
    .getCasesByStatusAndByJudge({
      applicationContext,
      judgeName: searchEntity.judgeName,
      statuses,
    });

  return {
    submittedAndCavCasesByJudge,
  };
};
