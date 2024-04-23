import { CaseWithSelectionInfo } from '@shared/business/utilities/getSelectedConsolidatedCasesToMultiDocketOn';
import { state } from '@web-client/presenter/app.cerebral';

export const getPdfUrlAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{
  documentTitle: string;
  contentHtml: string;
  eventCode: string;
}>) => {
  const { contentHtml, documentTitle, eventCode } = props;
  const docketNumber = get(state.caseDetail.docketNumber);

  const consolidatedCasesToMultiDocketOn =
    get(state.createOrderSelectedCases) ||
    get(state.modal.form.consolidatedCasesToMultiDocketOn);

  const consolidatedCasesToMultiDocketOnMetaData: CaseWithSelectionInfo[] = (
    consolidatedCasesToMultiDocketOn || []
  ).map(caseInfo => ({
    checked: caseInfo.checked,
    docketNumberWithSuffix: caseInfo.docketNumberWithSuffix,
  }));

  const addedDocketNumbers = applicationContext
    .getUtilities()
    .getSelectedConsolidatedCasesToMultiDocketOn(
      consolidatedCasesToMultiDocketOnMetaData,
    );

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
