const {
  addServedStampToDocument,
} = require('../../useCases/courtIssuedDocument/addServedStampToDocument');
const {
  appendPaperServiceAddressPageToPdf,
} = require('../../utilities/appendPaperServiceAddressPageToPdf');
const {
  sendServedPartiesEmails,
} = require('../../utilities/sendServedPartiesEmails');
const { formatDateString } = require('../../utilities/DateHandler');
const { PDFDocument } = require('pdf-lib');
/**
 * serveDocumentOnParties
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseEntity the case entity containing the document to serve
 * @param {object} providers.documentEntity the document entity for the document to serve
 * @param {object} providers.servedParties the aggregated parties to serve
 * @returns {string} the url of the paper service PDF in s3 if there are paper service parties
 */
exports.serveDocumentOnParties = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  servedParties,
}) => {
  let paperServicePdfUrl;

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentEntity.documentId,
    })
    .promise();

  const serviceStampDate = formatDateString(documentEntity.servedAt, 'MMDDYY');

  const newPdfData = await addServedStampToDocument({
    pdfData,
    serviceStampText: `Served ${serviceStampDate}`,
  });

  applicationContext.logger.time('Saving S3 Document');
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    documentId: documentEntity.documentId,
  });
  applicationContext.logger.timeEnd('Saving S3 Document');

  await sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    documentEntity,
    servedParties,
  });

  if (servedParties.paper.length > 0) {
    const noticeDoc = await PDFDocument.load(newPdfData);
    let newPdfDoc = await PDFDocument.create();

    await appendPaperServiceAddressPageToPdf({
      applicationContext,
      caseEntity,
      newPdfDoc,
      noticeDoc,
      servedParties,
    });

    const paperServicePdfData = await newPdfDoc.save();
    const paperServicePdfId = applicationContext.getUniqueId();

    applicationContext.logger.time('Saving S3 Document');
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: paperServicePdfData,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });
    applicationContext.logger.timeEnd('Saving S3 Document');

    const {
      url,
    } = await applicationContext.getPersistenceGateway().getDownloadPolicyUrl({
      applicationContext,
      documentId: paperServicePdfId,
      useTempBucket: true,
    });

    paperServicePdfUrl = url;
  }
  return paperServicePdfUrl;
};
