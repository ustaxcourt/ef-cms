import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getTrialSessionsForJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
 */
export const getTrialSessionsForJudgeInteractor = async (
  applicationContext: IApplicationContext,
  judgeId: string,
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

  const judgeSessions = trialSessions.filter(
    session => session.judge?.userId === judgeId,
  );

  const validatedSessions = TrialSession.validateRawCollection(
    judgeSessions as any,
    {
      applicationContext,
    },
  );

  return validatedSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession as any),
  );
};
