import { ClientApplicationContext } from '@web-client/applicationContext';
import { ValidateCaseForNewMinuteSheetResult } from '@web-api/business/useCases/trialSessionMinutes/validateCaseForNewMinuteSheetInteractor';
import { get } from '../requests';

/**
 * validateCaseForNewMinuteSheetInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to validate
 * @param {string} providers.trialSessionId the id of the trial session
 * @returns {Promise<*>} the promise of the api call
 */
export const validateCaseForNewMinuteSheetInteractor = (
  applicationContext: ClientApplicationContext,
  { docketNumber, trialSessionId }: { docketNumber: string; trialSessionId: string },
): Promise<ValidateCaseForNewMinuteSheetResult> => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/validate-case-for-minute-sheet`,
    params: { docketNumber },
  });
};
