import { Case } from '../../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../../../web-api/src/errors/errors';

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

  // instead of sending EVERY docket entry over, the front end only cares about the PMT documents not stricken
  // to figure out the filingPartiesCode
  const casesWithMinimalRequiredDocketEntries = cases.map(aCase => ({
    ...aCase,
    docketEntries: aCase.docketEntries.filter(
      docketEntry => docketEntry.eventCode === 'PMT' && !docketEntry.isStricken,
    ),
  }));

  return Case.validateRawCollection(casesWithMinimalRequiredDocketEntries, {
    applicationContext,
  });
};
