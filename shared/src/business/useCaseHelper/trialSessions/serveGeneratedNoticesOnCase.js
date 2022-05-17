exports.serveGeneratedNoticesOnCase = async ({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDocketEntryEntity,
  noticeDocumentPdfData,
  PDFDocument,
  servedParties,
}) => {
  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: noticeDocketEntryEntity.docketEntryId,
    servedParties,
  });

  if (servedParties.paper.length > 0) {
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
