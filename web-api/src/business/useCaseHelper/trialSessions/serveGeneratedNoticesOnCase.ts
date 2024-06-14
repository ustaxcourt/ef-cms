/**
 * serveGeneratedNoticesOnCase
 *
 * @param {object} providers the providers object
 * @param {object} applicationContext the application context
 * @param {object} providers.caseEntity the case data
 * @param {object} providers.newPdfDoc the new pdf document
 * @param {object} providers.noticeDocketEntryEntity the notice docket entry entity
 * @param {object} providers.noticeDocumentPdfData the notice document pdf data
 * @param {object} providers.servedParties the served parties
 */
export const serveGeneratedNoticesOnCase = async ({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDocketEntryEntity,
  noticeDocumentPdfData,
  servedParties,
  skipEmailToIrs = false,
}) => {
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: noticeDocketEntryEntity.docketEntryId,
    servedParties,
    skipEmailToIrs,
  });

  if (servedParties.paper.length > 0) {
    const { PDFDocument } = await applicationContext.getPdfLib();
    const noticeDocumentPdf = await PDFDocument.load(noticeDocumentPdfData);

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: noticeDocumentPdf,
        servedParties,
      });
  }
};
