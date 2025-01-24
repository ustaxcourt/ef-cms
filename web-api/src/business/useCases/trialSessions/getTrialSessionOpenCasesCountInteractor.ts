import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesInTrialSession } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';

export const getTrialSessionOpenCasesCountInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{
  calendaredCaseEntitiesCount: number;
  casesThatShouldReceiveNoticesCount: number;
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const TRIAL_SESSION = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  if (!TRIAL_SESSION) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const { calendaredCaseEntities, casesThatShouldReceiveNotices } =
    await getCasesInTrialSession({
      applicationContext,
      trialSession: TRIAL_SESSION,
      authorizedUser,
    });

  return {
    calendaredCaseEntitiesCount: calendaredCaseEntities.length,
    casesThatShouldReceiveNoticesCount: casesThatShouldReceiveNotices.length,
  };
};
