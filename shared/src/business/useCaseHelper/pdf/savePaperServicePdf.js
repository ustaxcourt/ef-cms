/**
 * savePaperServicePdf helper function
 *
 * @param {array} fields array of pdf form fields
 */

exports.savePaperServicePdf = async ({ applicationContext, document }) => {
  let hasPaper = document.getPages().length;
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
    hasPaper = true;

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
