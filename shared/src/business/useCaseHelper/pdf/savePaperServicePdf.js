/**
 * savePaperServicePdf helper function
 *
 * @param {array} applicationContext the application context
 * @param {array} document the document to be saved
 * @returns {Object} the service information
 */
exports.savePaperServicePdf = async ({ applicationContext, document }) => {
  let hasPaper = !!document.getPages().length;
  let docketEntryId = null;
  let pdfInfo = null;

  if (hasPaper) {
    const paperServicePdfData = await document.save();
    docketEntryId = applicationContext.getUniqueId();
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      key: docketEntryId,
      useTempBucket: true,
    });

    pdfInfo = await applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl({
        applicationContext,
        key: docketEntryId,
        useTempBucket: true,
      });
  }

  return { docketEntryId, hasPaper, url: pdfInfo ? pdfInfo.url : null };
};
