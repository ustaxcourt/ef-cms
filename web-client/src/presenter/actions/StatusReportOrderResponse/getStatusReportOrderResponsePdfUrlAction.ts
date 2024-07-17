import { STATUS_REPORT_ORDER_RESPONSE_OPTIONS } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export const getStatusReportOrderResponsePdfUrlAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  documentTitle: string;
  contentHtml: string;
  eventCode: string;
}>): Promise<{ pdfUrl: string }> => {
  const { contentHtml, documentTitle, eventCode } = props;
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketNumbersToDisplay = get(
    state.statusReportOrderResponse.docketNumbersToDisplay,
  );
  const issueOrder = get(state.form.issueOrder);

  const addedDocketNumbers =
    !!issueOrder &&
    issueOrder ===
      STATUS_REPORT_ORDER_RESPONSE_OPTIONS.issueOrderOptions.allCasesInGroup
      ? docketNumbersToDisplay
      : [];

  const { url } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers,
      contentHtml,
      docketNumber,
      documentTitle,
      eventCode,
    });

  return { pdfUrl: url };
};
