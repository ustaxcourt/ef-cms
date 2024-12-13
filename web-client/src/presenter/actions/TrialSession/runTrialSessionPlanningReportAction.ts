/**
 * get the pdf file and pdf blob url from the passed in htmlString
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the pdfUrl
 */
export const runTrialSessionPlanningReportAction = async ({
  applicationContext,
  props,
}: ActionProps<{ term: string; year: number }>) => {
  const { term, year } = props;

  const { url } = await applicationContext
    .getUseCases()
    .runTrialSessionPlanningReportInteractor(applicationContext, {
      term,
      year,
    });

  applicationContext.getUtilities().openUrlInNewTab({ url });
};
