import { post } from '../requests';

/**
 * set trial session calendar
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialSessionId the id of the trial session to set the calendar
 * @returns {Promise<*>} the promise of the api call
 */
export const setTrialSessionCalendarInteractor = (
  applicationContext,
  { trialSessionId },
) => {
  return post({
    applicationContext,
    endpoint: `/trial-sessions/${trialSessionId}/set-calendar`,
  });
};
