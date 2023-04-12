import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { User } from '../../entities/User';
import { getJudgeLastName } from '../../utilities/getFormattedJudgeName';
import { getJudgesChambers } from '../../../persistence/dynamo/chambers/getJudgesChambers';

const getJudgeNameForUser = async (
  applicationContext: any,
  authorizedUser: any,
) => {
  const userRaw = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: authorizedUser.userId,
  });

  const userEntity = new User(userRaw);

  const isChambersUser = userEntity.role === ROLES.chambers;

  let judgeName;
  if (isChambersUser) {
    const chambersInfo: any = getJudgesChambers();

    const sectionObject: any = Object.values(chambersInfo).find(
      obj => obj.section === userEntity.section,
    );

    judgeName = getJudgeLastName(sectionObject.judgeFullName);
  } else {
    judgeName = userEntity.name;
  }
  return judgeName;
};

/**
 * generateJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.endDate the date to end the search for judge activity
 * @param {string} providers.startDate the date to start the search for judge activity
 * @returns {object} errors (null if no errors)
 */
export const generateJudgeActivityReportInteractor = async (
  applicationContext,
  { endDate, startDate }: { endDate: string; startDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  let judgeName = await getJudgeNameForUser(applicationContext, authorizedUser);

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

  const closedCasesByJudge = await applicationContext
    .getPersistenceGateway()
    .getCasesClosedByJudge({
      applicationContext,
      endDate: searchEntity.endDate,
      judgeName,
      startDate: searchEntity.startDate,
    });

  const closedDismissedCases = closedCasesByJudge.filter(
    caseItem => caseItem.status === CASE_STATUS_TYPES.closedDismissed,
  );
  const closedCases = closedCasesByJudge.filter(
    caseItem => caseItem.status === CASE_STATUS_TYPES.closed,
  );

  return {
    closedCases,
    closedDismissedCases,
  };
};
