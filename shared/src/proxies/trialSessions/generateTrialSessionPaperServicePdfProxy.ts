import { post } from '../requests';

/**
 * generateTrialSessionPaperServicePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialNoticePdfsKeys the trial notice PDF keys of calendared cases associated with the trial session
 * @returns {Promise<*>} the promise of the api call
 */
export const generateTrialSessionPaperServicePdfInteractor = (
  applicationContext,
  { trialNoticePdfsKeys },
) => {
  return post({
    applicationContext,
    body: { trialNoticePdfsKeys },
    endpoint: '/trial-sessions/paper-service-pdf',
  });
};
