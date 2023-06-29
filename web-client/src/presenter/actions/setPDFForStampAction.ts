import { state } from '@web-client/presenter/app.cerebral';

/**
 * given a PDF document, returns a pdf.js object
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting loadPDFForSigning
 * @param {Function} providers.props used for getting docketEntryId
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pdfjsObj
 */
export const setPDFForStampAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, docketEntryId } = props;

  store.set(state.pdfForSigning.docketEntryId, docketEntryId);

  let pdfObj = await applicationContext
    .getUseCases()
    .loadPDFForSigningInteractor(applicationContext, {
      docketEntryId,
      docketNumber: caseDetail?.docketNumber,
      onlyCover: true,
    });

  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
