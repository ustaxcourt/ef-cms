import { CalendaredCase } from '@shared/business/entities/cases/CalendaredCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCalendaredCasesForTrialSession } from '@web-api/persistence/postgres/trialSessions/getCalendaredCasesForTrialSession';

export const getCalendaredCasesForTrialSessionInteractor = async (
  { trialSessionId }: { trialSessionId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const cases = await getCalendaredCasesForTrialSession({
      trialSessionId,
      excludeFields: ['correspondence', 'hearings'],
    });

  const casesWithMinimalRequiredInformation = cases.map(aCase => {
    return new CalendaredCase(aCase).validate().toRawObject();
  });

  return casesWithMinimalRequiredInformation;
};
