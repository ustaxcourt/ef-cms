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
}: ActionProps) => {
  const { docketNumberFilter, judgeFilter, sortField, sortOrder } = props;
  const params: { [key: string]: string } = {};
  if (docketNumberFilter) {
    params.docketNumber = docketNumberFilter;
  } else if (judgeFilter) {
    params.judge = judgeFilter;
    if (sortField) params.sortField = sortField;
    if (sortOrder) params.sortOrder = sortOrder;
  }

  const pdfUrl = await applicationContext
    .getUseCases()
    .generatePrintablePendingReportInteractor(applicationContext, params);

  return { pdfUrl };
};
