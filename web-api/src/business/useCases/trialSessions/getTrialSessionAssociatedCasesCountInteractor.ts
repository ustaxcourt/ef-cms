import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { applicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesInTrialSession } from '@web-api/business/useCases/trialSessions/updateTrialSessionInteractorHelper';
import { getTrialSessionById } from '@web-api/persistence/dynamo/trialSessions/getTrialSessionById';

export const getTrialSessionAssociatedCasesCountInteractor = async (
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
): Promise<{
  calendaredCaseEntitiesCount: number;
  casesThatShouldReceiveNoticesCount: number;
}> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const TRIAL_SESSION = await getTrialSessionById({
    applicationContext,
    trialSessionId,
  });

  if (!TRIAL_SESSION) {
    throw new NotFoundError(`Trial session ${trialSessionId} was not found.`);
  }

  const { calendaredCaseEntities, casesThatShouldReceiveNotices } =
    await getCasesInTrialSession({
      trialSession: TRIAL_SESSION,
      authorizedUser,
    });

  return {
    calendaredCaseEntitiesCount: calendaredCaseEntities.length,
    casesThatShouldReceiveNoticesCount: casesThatShouldReceiveNotices.length,
  };
};
