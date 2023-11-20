import { state } from '@web-client/presenter/app.cerebral';

export const getPdfUrlAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  contentHtml: string;
  documentTitle: string;
  signatureText: string;
}>) => {
  const { contentHtml, documentTitle, signatureText } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  const consolidatedCasesToMultiDocketOn = get(
    state.modal.form.consolidatedCasesToMultiDocketOn,
  );

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOn,
    );

  const { url } = await applicationContext
    .getUseCases()
    .createCourtIssuedOrderPdfFromHtmlInteractor(applicationContext, {
      addedDocketNumbers,
      contentHtml,
      docketNumber,
      documentTitle,
      signatureText,
    });

  return { pdfUrl: url };
};
