import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';

/**
 * generateJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.judgeName the name of the judge to generate the report for
 * @param {string} providers.startDate the date to start the search for judge activity
 * @returns {object} errors (null if no errors)
 */
//update this method infrastructure to remove judgeName
export const generateJudgeActivityReportInteractor = (
  applicationContext,
  { endDate, judgeName, startDate }: { endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  //if judge, use authorizedUser.name
  //if chambers user, use constant to find right object and grab judge name

  const userEntity = new User(authorizedUser);

  const isChambersUser = userEntity.isChambersUser();

  let judgeName;
  if (isChambersUser) {
    const chamberInfo = applicationContext
      .getPersistenceGateway()
      .getJudgesChambers();

    // Object.values()

    // [userEntity.section].judgeFullName;
    judgeName = getJudgeLastName(userEntity.section);
  } else {
    judgeName = userEntity.name;
  }

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // todo: add judge?
  const searchEntity = new JudgeActivityReportSearch(
    { endDate, startDate },
    {
      applicationContext,
    },
  );

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const closedCases = applicationContext
    .getPersistenceGateway()
    .getCasesClosedByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judgeName,
      startDate: searchEntity.startDate,
    });

  return {
    closedCases,
  };
};
