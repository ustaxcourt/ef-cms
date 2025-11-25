import { state } from '@web-client/presenter/app.cerebral';
import { PDFDocumentProxy } from 'pdfjs-dist';

export const setPDFForStampAction = async ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  const { caseDetail, docketEntryId, documentStorageId } = props;

  store.set(state.pdfForSigning.docketEntryId, docketEntryId);

  const pdfObj: PDFDocumentProxy = await applicationContext
    .getUseCases()
    .loadPDFForSigningInteractor(applicationContext, {
      documentStorageId,
      docketNumber: caseDetail?.docketNumber,
      onlyCover: true,
    });

  store.set(state.pdfForSigning.pdfjsObj, pdfObj);
};
