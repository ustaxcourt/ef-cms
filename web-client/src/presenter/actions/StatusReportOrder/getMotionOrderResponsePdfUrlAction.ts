import { state } from '@web-client/presenter/app.cerebral';

export const getMotionOrderResponsePdfUrlAction = async ({
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
  const docketNumbersToDisplay = get(state.form.docketNumbersToDisplay);

  const { url } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers: docketNumbersToDisplay,
      contentHtml,
      docketNumber,
      documentTitle,
      eventCode,
    });

  return { pdfUrl: url };
};
