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
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';

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

  const smallSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.small &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new,
  );

  const regularSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.regular &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new,
  );

  const hybridSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.hybrid &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new,
  );

  const motionHearingSessions = judgeSessionsInDateRange.filter(
    session =>
      session.sessionType === SESSION_TYPES.motionHearing &&
      session.sessionStatus !== SESSION_STATUS_TYPES.new,
  );

  const specialSessions = judgeSessionsInDateRange.filter(
    session => session.sessionType === SESSION_TYPES.special,
  );

  // Total Number of Special trial sessions the judge has been assigned to that have Start Dates that fall within this time frame
  // Total Number of Sessions for all non-Special sessions the judge has been assigned to that have Start Dates that fall within this time frame and are not in New status
  // now make a map with counts of sessionStatus: value, and switch on the type of sessions to determine value
  // value for session_type:
  // Regular/Small/Hybrid sessions: 1 session each
  // R/S/H session marked as part of a SWING session: .5 session each
  // Motion/Hearing: .5 session each
  // ? value of special = 1?
  // const validatedSessions = TrialSession.validateRawCollection(
  //   filteredJudgeSessions as any,
  //   {
  //     applicationContext,
  //   },
  // );

  // return validatedSessions.map(
  //   trialSession => new TrialSessionInfoDTO(trialSession as any),
  // );

  return {
    [SESSION_TYPES.small]: smallSessions.length,
    [SESSION_TYPES.regular]: regularSessions.length,
    [SESSION_TYPES.hybrid]: hybridSessions.length,
    [SESSION_TYPES.motionHearing]: motionHearingSessions.length,
    [SESSION_TYPES.special]: specialSessions.length,
  };
};
