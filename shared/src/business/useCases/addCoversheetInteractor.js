const { Case } = require('../entities/cases/Case');
const { coverLogo } = require('../assets/coverLogo');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const {
  generateCoverPagePdf,
} = require('../utilities/generateHTMLTemplateForPDF/generateCoverPagePdf');

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
      null;
  } else {
    dateReceivedFormatted =
      (documentEntity.createdAt &&
        applicationContext
          .getUtilities()
          .formatDateString(documentEntity.createdAt, 'MM/DD/YYYY hh:mm a')) ||
      null;
  }

  const dateFiledFormatted =
    (documentEntity.filingDate &&
      applicationContext
        .getUtilities()
        .formatDateString(documentEntity.filingDate, 'MMDDYYYY')) ||
    null;

  const caseCaption = caseEntity.caseCaption || Case.getCaseCaption(caseEntity);
  let caseCaptionNames = applicationContext.getCaseCaptionNames(caseCaption);
  let caseCaptionPostfix = '';
  if (caseCaptionNames !== caseCaption) {
    caseCaptionNames += ', ';
    caseCaptionPostfix = caseCaption.replace(caseCaptionNames, '');
  }

  let documentTitle =
    documentEntity.documentTitle || documentEntity.documentType;
  if (documentEntity.additionalInfo && documentEntity.addToCoversheet) {
    documentTitle += ` ${documentEntity.additionalInfo}`;
  }

  const coverSheetData = {
    caseCaptionPetitioner: caseCaptionNames,
    caseCaptionPostfix,
    caseCaptionRespondent: 'Commissioner of Internal Revenue',
    dateFiled: isLodged ? '' : dateFiledFormatted,
    dateLodged: isLodged ? dateFiledFormatted : '',
    dateReceived: dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumber:
      caseEntity.docketNumber + (caseEntity.docketNumberSuffix || ''),
    documentTitle,
    includesCertificateOfService:
      documentEntity.certificateOfService === true ? true : false,
    mailingDate: documentEntity.mailingDate || '',
    originallyFiledElectronically: !documentEntity.isPaper,
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
  const isLodged = documentEntity.lodged;

  const coverSheetData = exports.generateCoverSheetData({
    applicationContext,
    caseEntity,
    documentEntity,
  });

  const pdfDoc = await PDFDocument.load(pdfData);

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const getContentByKey = key => {
    const coverSheetDatumValue = coverSheetData[key];
    switch (key) {
      case 'includesCertificateOfService':
        if (coverSheetDatumValue) {
          return 'Certificate of Service';
        } else {
          return '';
        }
      case 'originallyFiledElectronically':
        if (coverSheetDatumValue) {
          return 'Electronically Filed';
        } else {
          return '';
        }
      default:
        return coverSheetDatumValue.toString();
    }
  };

  const content = await generateCoverPagePdf({
    applicationContext,
    content: {
      caseCaptionPet: getContentByKey('caseCaptionPetitioner'),
      caseCaptionResp: getContentByKey('caseCaptionRespondent'),
      certificateOfService: getContentByKey('includesCertificateOfService'),
      dateFiled: getContentByKey('dateFiled'),
      dateFiledLabel: isLodged ? '' : 'Filed',
      dateLodged: getContentByKey('dateLodged'),
      dateLodgedLabel: isLodged ? 'Lodged' : '',
      dateReceived: getContentByKey('dateReceived'),
      dateReceivedLabel: 'Received',
      dateServed: getContentByKey('dateServed'),
      docketNumber: `Docket Number: ${getContentByKey('docketNumber')}`,
      documentTitle: getContentByKey('documentTitle'),
      electronicallyFiled: getContentByKey('originallyFiledElectronically'),
      mailingDate: getContentByKey('mailingDate'),
      petitionerLabel: getContentByKey('caseCaptionPostfix'),
      respondentLabel: 'Respondent',
      vLabel: 'v.',
    },
  });

  const coverPageDocument = await PDFDocument.load(content);

  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  const coverPagePuppeteer = coverPageDocumentPages[0];

  pdfDoc.insertPage(0, coverPagePuppeteer);

  return pdfDoc.save();
};

/**
 * addCoversheetInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @param {string} providers.documentId the document id
 * @returns {Uint8Array} the new pdf data
 */
exports.addCoversheetInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  applicationContext.logger.time(`Fetching the Case for ${caseId}`);
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });
  applicationContext.logger.timeEnd(`Fetching the Case for ${caseId}`);

  const caseEntity = new Case(caseRecord, { applicationContext });

  const documentEntity = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  const documentIndex = caseEntity.documents.findIndex(
    document => document.documentId === documentId,
  );

  applicationContext.logger.time(
    `Fetching S3 File for Coversheet ${documentId}`,
  );
  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  applicationContext.logger.timeEnd(
    `Fetching S3 File for Coversheet ${documentId}`,
  );

  const newPdfData = await exports.addCoverToPdf({
    applicationContext,
    caseEntity,
    documentEntity,
    pdfData,
  });

  documentEntity.setAsProcessingStatusAsCompleted();

  applicationContext.logger.time(`Updating Document Status for ${documentId}`);
  await applicationContext
    .getPersistenceGateway()
    .updateDocumentProcessingStatus({
      applicationContext,
      caseId,
      documentIndex,
    });
  applicationContext.logger.timeEnd(
    `Updating Document Status for ${documentId}`,
  );

  applicationContext.logger.time(`Saving S3 Document for ${documentId}`);
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    documentId,
  });
  applicationContext.logger.timeEnd(`Saving S3 Document for ${documentId}`);

  return newPdfData;
};
