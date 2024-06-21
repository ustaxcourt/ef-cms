import { CalendaredCase } from '../../../../../shared/src/business/entities/cases/CalendaredCase';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

export const getCalendaredCasesForTrialSessionInteractor = async (
  applicationContext: ServerApplicationContext,
  { trialSessionId }: { trialSessionId: string },
) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, ROLE_PERMISSIONS.TRIAL_SESSIONS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const cases = await applicationContext
    .getPersistenceGateway()
    .getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId,
    });

  const casesWithMinimalRequiredInformation = cases.map(aCase => {
    return new CalendaredCase(aCase).validate().toRawObject();
  });

  return casesWithMinimalRequiredInformation;
};
