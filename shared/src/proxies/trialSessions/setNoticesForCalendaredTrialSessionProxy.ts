import { post } from '../requests';

/**
 * setNoticesForCalendaredTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the trial session id
 * @param {string} providers.docketNumber optional docketNumber for setting a single case
 * @returns {Promise<*>} the promise of the api call
 */
export const setNoticesForCalendaredTrialSessionInteractor = (
  applicationContext,
  { clientConnectionId, trialSessionId },
) => {
  return post({
    applicationContext,
    body: {
      clientConnectionId,
    },
    endpoint: `/async/trial-sessions/${trialSessionId}/generate-notices`,
  });
};
