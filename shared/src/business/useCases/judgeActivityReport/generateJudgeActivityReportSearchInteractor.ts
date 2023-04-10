import { InvalidRequestError } from '../../../../../web-client/src/presenter/errors/InvalidRequestError';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * generateJudgeActivityReportSearchInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.startDate the date to start the search for judge activity
 * @param {string} providers.endDate the date to end the search for judge activity
 * @returns {object} errors (null if no errors)
 */
export const generateJudgeActivityReportSearchInteractor = (
  applicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch(
    { endDate, startDate },
    {
      applicationContext,
    },
  );

  if (!searchEntity.isValid()) {
    throw new InvalidRequestError();
  }

  const closedCases = applicationContext
    .getPersistenceGateway()
    .getCasesClosedByJudge({});

  return {
    closedCases,
  };
};
