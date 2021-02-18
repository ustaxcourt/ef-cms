const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const { saveFileAndGenerateUrl } = require('./saveFileAndGenerateUrl');

/**
 * serveDocumentAndGetPaperServicePdf
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity containing the docket entry to serve
 * @param {string} providers.docketEntryId the id of the docket entry to serve
 * @returns {Promise<*>} the updated case entity
 */
exports.serveDocumentAndGetPaperServicePdf = async ({
  applicationContext,
  caseEntity,
  docketEntryId,
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId,
    servedParties,
  });

  if (servedParties.paper.length > 0) {
    const { PDFDocument } = await applicationContext.getPdfLib();

    const { Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();

    const originalPdfDoc = await PDFDocument.load(pdfData);

    let newPdfDoc = await PDFDocument.create();

    await applicationContext
      .getUseCaseHelpers()
      .appendPaperServiceAddressPageToPdf({
        applicationContext,
        caseEntity,
        newPdfDoc,
        noticeDoc: originalPdfDoc,
        servedParties,
      });

    const paperServicePdfData = await newPdfDoc.save();
    const { url } = await saveFileAndGenerateUrl({
      applicationContext,
      file: paperServicePdfData,
      useTempBucket: true,
    });

    return { pdfUrl: url };
  }
};
