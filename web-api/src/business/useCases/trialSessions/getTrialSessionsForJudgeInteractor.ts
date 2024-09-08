import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { TrialSession } from '../../../../../shared/src/business/entities/trialSessions/TrialSession';
import { TrialSessionInfoDTO } from '../../../../../shared/src/business/dto/trialSessions/TrialSessionInfoDTO';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * getTrialSessionsForJudgeInteractor
 *
 * @param {object} applicationContext the application context
 * @returns {Array<TrialSession>} the trial sessions returned from persistence
 */
export const getTrialSessionsForJudgeInteractor = async (
  applicationContext: ServerApplicationContext,
  judgeId: string,
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
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
  );

  return validatedSessions.map(
    trialSession => new TrialSessionInfoDTO(trialSession as any),
  );
};
