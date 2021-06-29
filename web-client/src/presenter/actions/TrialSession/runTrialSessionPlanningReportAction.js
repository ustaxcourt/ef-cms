import { state } from 'cerebral';

/**
 * get the pdf file and pdf blob url from the passed in htmlString
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const runTrialSessionPlanningReportAction = async ({
  applicationContext,
  get,
}) => {
  const { term, year } = get(state.modal);

  const { url } = await applicationContext
    .getUseCases()
    .runTrialSessionPlanningReportInteractor(applicationContext, {
      term,
      year,
    });

  return { pdfUrl: url };
};
