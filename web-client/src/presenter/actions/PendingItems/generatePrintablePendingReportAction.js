/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {Promise} async action
 */
export const generatePrintablePendingReportAction = async ({
  applicationContext,
  props,
}) => {
  const { docketNumberFilter, judgeFilter } = props;

  const params = {};
  if (docketNumberFilter) {
    params.docketNumber = docketNumberFilter;
  } else if (judgeFilter) {
    params.judge = judgeFilter;
  }

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintablePendingReportInteractor(applicationContext, params);

  return { pdfUrl };
};
