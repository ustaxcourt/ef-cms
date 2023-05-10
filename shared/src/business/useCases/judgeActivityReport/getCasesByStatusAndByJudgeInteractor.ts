import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

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
export const getCasesByStatusAndByJudgeInteractor = async (
  applicationContext,
  {
    judgeName,
    statuses,
  }: {
    judgeName: string;
    statuses: string[];
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const submittedAndCavCasesByJudge = await applicationContext
    .getPersistenceGateway()
    .getCasesByStatusAndByJudge({
      applicationContext,
      judgeName,
      statuses,
    });

  return submittedAndCavCasesByJudge.foundCases;
};
