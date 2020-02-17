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
  const { caseIdFilter, judgeFilter } = props;

  const params = {
    applicationContext,
  };

  if (caseIdFilter) {
    params.caseId = caseIdFilter;
  } else if (judgeFilter) {
    params.judge = judgeFilter;
  }

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintablePendingReportInteractor(params);

  return { pdfUrl };
};
