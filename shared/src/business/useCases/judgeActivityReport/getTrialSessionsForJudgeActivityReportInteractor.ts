import { InvalidRequest, UnauthorizedError } from '../../../errors/errors';
import { JudgeActivityReportSearch } from '../../entities/judgeActivityReport/JudgeActivityReportSearch';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import {
  SESSION_STATUS_TYPES,
  SESSION_TYPES,
} from '../../entities/EntityConstants';

/**
 * getTrialSessionsForJudgeActivityReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers.endDate the report end date
 * @param {object} providers.judgeId the judgeId to query for
 * @param {object} providers.startDate the report start date
 * @returns {Object} the counts of the different session types held for the judge
 */
export const getTrialSessionsForJudgeActivityReportInteractor = async (
  applicationContext: IApplicationContext,
  {
    endDate,
    judgeId,
    startDate,
  }: {
    judgeId: string;
    endDate: string;
    startDate: string;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.JUDGE_ACTIVITY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const searchEntity = new JudgeActivityReportSearch({
    endDate,
    judgeId,
    startDate,
  });

  if (!searchEntity.isValid()) {
    throw new InvalidRequest();
  }

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  const judgeSessionsInDateRange = trialSessions.filter(
    session =>
      session.judge?.userId === searchEntity.judgeId &&
      session.startDate <= searchEntity.endDate &&
      session.startDate >= searchEntity.startDate,
  );

  const smallNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      isTypeOf(SESSION_TYPES.small)(session) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const smallSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.small)(session) && isSwingSession(session),
    ).length / 2;

  const regularNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      isTypeOf(SESSION_TYPES.regular)(session) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const regularSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.regular)(session) &&
        !isNew(session) &&
        isSwingSession(session),
    ).length / 2;

  const hybridNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      (isTypeOf(SESSION_TYPES.hybrid)(session) ||
        isTypeOf(SESSION_TYPES.hybridSmall)(session)) &&
      !isNew(session) &&
      !isSwingSession(session),
  ).length;

  const hybridSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        (isTypeOf(SESSION_TYPES.hybrid)(session) ||
          isTypeOf(SESSION_TYPES.hybridSmall)(session)) &&
        !isNew(session) &&
        isSwingSession(session),
    ).length / 2;

  const motionHearingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        isTypeOf(SESSION_TYPES.motionHearing)(session) && !isNew(session),
    ).length / 2;

  const specialSessions = judgeSessionsInDateRange.filter(session =>
    isTypeOf(SESSION_TYPES.special)(session),
  ).length;

  return {
    [SESSION_TYPES.regular]: regularSwingSessions + regularNonSwingSessions,
    [SESSION_TYPES.small]: smallNonSwingSessions + smallSwingSessions,
    [SESSION_TYPES.hybrid]: hybridSwingSessions + hybridNonSwingSessions,
    [SESSION_TYPES.special]: specialSessions,
    [SESSION_TYPES.motionHearing]: motionHearingSessions,
  };
};

const isNew = session => session.sessionStatus === SESSION_STATUS_TYPES.new;
const isTypeOf = sessionType => {
  return session => session.sessionType === sessionType;
};
const isSwingSession = session => session.swingSession;
