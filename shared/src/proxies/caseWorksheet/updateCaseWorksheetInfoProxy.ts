import { post } from '../requests';

/**
 * updateTrialSessionInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.trialSession the trial session data
 * @returns {Promise<*>} the promise of the api call
 */
export const updateCaseWorksheetInfoInteractor = (
  applicationContext,
  body: {
    docketNumber: string;
    statusOfMatter?: string;
    finalBriefDueDate?: string;
  },
) => {
  return post({
    applicationContext,
    body,
    endpoint: `/cases/${body.docketNumber}/case-worksheet`,
  });
};
