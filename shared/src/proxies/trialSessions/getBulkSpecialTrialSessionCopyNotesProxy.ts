import { post } from '../requests';

/**
 * addCaseToTrialSessionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.specialTrialSessions notes on why the case was added to the trial session
 * @returns {Promise<*>} the promise of the api call
 */

export const getBulkSpecialTrialSessionCopyNotesInteractor = (
  applicationContext,
  { specialTrialSessions },
) =>
  post({
    applicationContext,
    body: { specialTrialSessions },
    endpoint: '/trial-sessions/bulk-copy-notes',
  });
