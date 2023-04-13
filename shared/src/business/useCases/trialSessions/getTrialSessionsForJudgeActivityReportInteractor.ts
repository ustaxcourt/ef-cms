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
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
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

  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
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
      session.sessionType === SESSION_TYPES.small &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new &&
      !!session.swingSession,
  ).length;

  const smallSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        session.sessionType === SESSION_TYPES.small && session.swingSession,
    ).length / 2;

  const regularNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.regular &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new &&
      !!session.swingSession,
  ).length;

  const regularSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        session.sessionType === SESSION_TYPES.regular &&
        session.sessionStatus !== SESSION_STATUS_TYPES.new &&
        session.swingSession,
    ).length / 2;

  const hybridNonSwingSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.hybrid &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new &&
      !!session.swingSession,
  ).length;

  const hybridSwingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        session.sessionType === SESSION_TYPES.hybrid &&
        session.sessionStatus !== SESSION_STATUS_TYPES.new &&
        session.swingSession,
    ).length / 2;

  const motionHearingSessions =
    judgeSessionsInDateRange.filter(
      session =>
        session.sessionType === SESSION_TYPES.motionHearing &&
        session.sessionStatus !== SESSION_STATUS_TYPES.new,
    ).length / 2;

  const specialSessions = judgeSessionsInDateRange.filter(
    session => session.sessionType === SESSION_TYPES.special,
  ).length;

  return {
    [SESSION_TYPES.small]: smallNonSwingSessions + smallSwingSessions,
    [SESSION_TYPES.regular]: regularSwingSessions + regularNonSwingSessions,
    [SESSION_TYPES.hybrid]: hybridSwingSessions + hybridNonSwingSessions,
    [SESSION_TYPES.motionHearing]: motionHearingSessions,
    [SESSION_TYPES.special]: specialSessions,
  };
};
