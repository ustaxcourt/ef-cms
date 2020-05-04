const {
  generateCoverPagePdf,
} = require('../utilities/generateHTMLTemplateForPDF/generateCoverPagePdf');
const { Case } = require('../entities/cases/Case');
const { PDFDocument } = require('pdf-lib');

/**
 * a helper function which assembles the correct data to be used in the generation of a PDF
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.documentEntity the document entity we are creating the cover for
 * @returns {object} the key/value pairs of computed strings
 */
exports.generateCoverSheetData = ({
  applicationContext,
  caseEntity,
  documentEntity,
}) => {
  const isLodged = documentEntity.lodged;
  const { isPaper } = documentEntity;

  const dateServedFormatted =
    (documentEntity.servedAt &&
      'Served ' +
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.servedAt, 'MMDDYYYY')) ||
    '';

  let dateReceivedFormatted;

  if (isPaper) {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MMDDYYYY')) ||
      '';
  } else {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MM/DD/YYYY hh:mm a')) ||
      '';
  }

  const dateFiledFormatted =
    (documentEntity.filingDate &&
      applicationContext
        .getUtilities()
        .formatDateString(documentEntity.filingDate, 'MMDDYYYY')) ||
    '';

  const caseCaption = caseEntity.caseCaption || Case.getCaseCaption(caseEntity);
  let caseTitle = applicationContext.getCaseTitle(caseCaption);
  let caseCaptionExtension = '';
  if (caseTitle !== caseCaption) {
    caseTitle += ', ';
    caseCaptionExtension = caseCaption.replace(caseTitle, '');
  }

  let documentTitle =
    documentEntity.documentTitle || documentEntity.documentType;
  if (documentEntity.additionalInfo && documentEntity.addToCoversheet) {
    documentTitle += ` ${documentEntity.additionalInfo}`;
  }

  const docketNumberWithSuffix =
    caseEntity.docketNumber + (caseEntity.docketNumberSuffix || '');

  const coverSheetData = {
    caseCaptionExtension,
    caseTitle,
    certificateOfService:
      documentEntity.certificateOfService === true
        ? 'Certificate of Service'
        : '',
    dateFiledLodged: dateFiledFormatted,
    dateFiledLodgedLabel: isLodged ? 'Lodged' : 'Filed',
    dateReceived: dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumber: `Docket Number: ${docketNumberWithSuffix}`,
    documentTitle,
    electronicallyFiled: documentEntity.isPaper ? '' : 'Electronically Filed',
    mailingDate: documentEntity.mailingDate || '',
  };
  return coverSheetData;
};
/**
 * a helper function which creates a coversheet, prepends it to a pdf, and returns the new pdf
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.documentEntity the document entity we are creating the cover for
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with a coversheet attached
 */
exports.addCoverToPdf = async ({
  applicationContext,
  caseEntity,
  documentEntity,
  pdfData,
}) => {
  const coverSheetData = exports.generateCoverSheetData({
    applicationContext,
    caseEntity,
    documentEntity,
  });

  const pdfDoc = await PDFDocument.load(pdfData);

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const coverPagePdf = await generateCoverPagePdf({
    applicationContext,
    content: coverSheetData,
  });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);
  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  pdfDoc.insertPage(0, coverPageDocumentPages[0]);

  return pdfDoc.save();
};

/**
 * addCoversheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 */
exports.addCoversheetInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  const documentEntity = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  let pdfData;
  try {
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: documentId,
      })
      .promise();
    pdfData = Body;
  } catch (err) {
    err.message = `${err.message} document id is ${documentId}`;
    throw err;
  }

  const newPdfData = await exports.addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity,
    pdfData,
  });

  documentEntity.setAsProcessingStatusAsCompleted();

  await applicationContext
    .getPersistenceGateway()
    .updateDocumentProcessingStatus({
      applicationContext,
      caseId,
      documentId,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    documentId,
  });
};
