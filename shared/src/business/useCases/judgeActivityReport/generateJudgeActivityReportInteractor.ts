import { CASE_STATUS_TYPES, ROLES } from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { getJudgeLastName } from '../../utilities/getFormattedJudgeName';
import { getJudgesChambers } from '../../../persistence/dynamo/chambers/getJudgesChambers';

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

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const judgeName = await getJudgeNameForUser(
    applicationContext,
    authorizedUser,
  );

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeName,
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
      judgeName: searchEntity.judgeName,
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
    total: casesClosedByJudge.length,
  };
};

const getJudgeNameForUser = async (
  applicationContext: any,
  authorizedUser: any,
) => {
  const user = await applicationContext.getPersistenceGateway().getUserById({
    applicationContext,
    userId: authorizedUser.userId,
  });

  const isChambersUser = user.role === ROLES.chambers;

  let judgeName;
  if (isChambersUser) {
    const chambersData: any = getJudgesChambers();

    const userSectionInfo: any = Object.values(chambersData).find(
      obj => obj.section === user.section,
    );

    judgeName = getJudgeLastName(userSectionInfo.judgeFullName);
  } else {
    judgeName = user.name;
  }
  return judgeName;
};
