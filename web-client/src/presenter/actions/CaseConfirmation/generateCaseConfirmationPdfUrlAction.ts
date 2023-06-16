import { state } from '@web-client/presenter/app.cerebral';

/**
 * get the url from the case details
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the pdfUrl
 */
export const generateCaseConfirmationPdfUrlAction = async ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const docketNumber = get(state.caseDetail.docketNumber);
  const docketEntries = get(state.caseDetail.docketEntries);

  let url;

  const notrOnDocketRecord = docketEntries.find(
    docketEntry => docketEntry.eventCode === 'NOTR',
  );

  if (notrOnDocketRecord) {
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        key: notrOnDocketRecord.docketEntryId,
      }));
  } else {
    // before story 9470 - the NOTR wasn't on the docket record,
    // so we fallback to support legacy NOTR documents
    ({ url } = await applicationContext
      .getUseCases()
      .getDocumentDownloadUrlInteractor(applicationContext, {
        docketNumber,
        key: `case-${docketNumber}-confirmation.pdf`,
      }));
  }

  store.set(state.pdfPreviewUrl, url);
};
