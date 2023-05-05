import { get } from '../requests';

/**
 * getTrialSessionDetailsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to get the details
 * @returns {Promise<*>} the promise of the api call
 */
export const getTrialSessionDetailsInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return get({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}`,
  });
};
