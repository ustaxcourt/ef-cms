import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Case } from '../../entities/cases/Case';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getCalendaredCasesForTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to get the calendared cases
 * @returns {Promise} the promise of the getCalendaredCasesForTrialSession call
 */
export const getCalendaredCasesForTrialSessionInteractor = async (
  applicationContext: IApplicationContext,
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

  return Case.validateRawCollection(cases, { applicationContext });
};
