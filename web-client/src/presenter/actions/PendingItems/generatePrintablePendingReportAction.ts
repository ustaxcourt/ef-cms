export const generatePrintablePendingReportAction = async ({
  applicationContext,
  props,
}: ActionProps<{
  docketNumberFilter?: string;
  judgeFilter?: string;
  sortField?: string;
  sortOrder?: string;
}>) => {
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
