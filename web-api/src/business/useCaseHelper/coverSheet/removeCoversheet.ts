import { ServerApplicationContext } from '@web-api/applicationContext';

export const removeCoversheet = async (
  applicationContext: ServerApplicationContext,
  { documentStorageId }: { documentStorageId: string },
) => {
  try {
    const pdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: documentStorageId,
      });

    const { PDFDocument } = await applicationContext.getPdfLib();

    const pdfDoc = await PDFDocument.load(pdfData);

    pdfDoc.removePage(0);

    const pdfWithoutCoversheet = await pdfDoc.save();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      document: pdfWithoutCoversheet,
      key: documentStorageId,
    });

    return { numberOfPages: pdfDoc.getPageCount() };
  } catch (err) {
    const error = err as Error;
    error.message = `${error.message} documentStorageId is ${documentStorageId}`;
    throw error;
  }
};
