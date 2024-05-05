import { ServerApplicationContext } from '@web-api/applicationContext';

export const removeCoversheet = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId }: { docketEntryId: string },
) => {
  try {
    const pdfData = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: docketEntryId,
      });

    const { PDFDocument } = await applicationContext.getPdfLib();

    const pdfDoc = await PDFDocument.load(pdfData);

    pdfDoc.removePage(0);

    const pdfWithoutCoversheet = await pdfDoc.save();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: pdfWithoutCoversheet,
      key: docketEntryId,
    });

    return { numberOfPages: pdfDoc.getPageCount() };
  } catch (err) {
    const error = err as Error;
    error.message = `${error.message} docket entry id is ${docketEntryId}`;
    throw error;
  }
};
