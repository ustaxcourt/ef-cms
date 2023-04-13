import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '../../../errors/errors';

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

  const trialSessions = await applicationContext
    .getPersistenceGateway()
    .getTrialSessions({
      applicationContext,
    });

  console.log(applicationContext.getUtilities().createISODateString(endDate)); //2020-08-10T05:00:00.000Z

  const judgeSessionsInDateRange = trialSessions.filter(
    session =>
      session.judge?.userId === judgeId &&
      session.startDate <=
        applicationContext.getUtilities().createISODateString(endDate),
    // &&
    // session.startDate >= startDate,
  );

  // now make a map with counts of sessionStatus: value, and switch on the type of sessions to determine value
  // value for session_type:
  // Regular/Small/Hybrid sessions: 1 session each
  // R/S/H session marked as part of a SWING session: .5 session each
  // Motion/Hearing: .5 session each
  // ? value of special = 1?
  const validatedSessions = TrialSession.validateRawCollection(
    judgeSessionsInDateRange as any,
    {
      applicationContext,
    },
  );

  return validatedSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession as any),
  );
};
