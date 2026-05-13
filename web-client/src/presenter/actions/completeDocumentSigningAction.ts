import { state } from '@web-client/presenter/app.cerebral';

export const completeDocumentSigningAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const originalDocketEntryId = get(state.pdfForSigning.docketEntryId);
  const { docketNumber } = get(state.caseDetail);
  const parentMessageId = get(state.parentMessageId);
  let docketEntryId;

  const signatureData = get(state.pdfForSigning.signatureData);
  if (signatureData?.x) {
    const appContext = applicationContext as unknown as IApplicationContext;
    const { nameForSigning, nameForSigningLine2, pageNumber } = get(
      state.pdfForSigning,
    );
    const { scale, x, y } = signatureData;

    const windowWithPdfjs = window as Window & {
      pdfjsObj?: { getData: () => Promise<unknown> };
    };
    const pdfjsObj: { getData: () => Promise<unknown> } | null =
      windowWithPdfjs.pdfjsObj || get(state.pdfForSigning.pdfjsObj);

    if (!pdfjsObj) {
      return path.error({
        alertError: {
          message: 'Unable to complete signing. Please try again.',
        },
      });
    }

    // generate signed document to bytes
    const signedPdfBytes = await applicationContext
      .getUseCases()
      .generateSignedDocumentInteractor(appContext, {
        pageIndex: pageNumber - 1,
        // pdf.js starts at 1
        pdfData: await pdfjsObj.getData(),
        posX: x,
        posY: y,
        scale,
        sigTextData: {
          signatureName: `(Signed) ${nameForSigning}`,
          signatureTitle: nameForSigningLine2,
        },
      });

    const documentFile = new File([signedPdfBytes], 'myfile.pdf', {
      type: 'application/pdf',
    });

    const signedDocumentFromUploadId = await applicationContext
      .getPersistenceGateway()
      .uploadDocumentFromClient({
        applicationContext,
        document: documentFile,
      });

    ({ signedDocketEntryId: docketEntryId } = await applicationContext
      .getUseCases()
      .saveSignedDocumentInteractor(applicationContext, {
        docketNumber,
        nameForSigning,
        originalDocketEntryId,
        parentMessageId,
        signedDocumentStorageId: signedDocumentFromUploadId,
      }));
  }

  let redirectUrl;

  if (parentMessageId) {
    redirectUrl = `/messages/${docketNumber}/message-detail/${parentMessageId}?documentId=${docketEntryId}`;
  } else {
    redirectUrl = `/case-detail/${docketNumber}/draft-documents?docketEntryId=${docketEntryId}`;
  }

  return path.success({
    docketEntryId,
    docketNumber,
    redirectUrl,
    tab: 'docketRecord',
  });
};
