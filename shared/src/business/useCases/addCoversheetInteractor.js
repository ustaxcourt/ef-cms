const {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { omit } = require('lodash');

const formatDateReceived = ({
  applicationContext,
  docketEntryEntity,
  isPaper,
}) => {
  const formatString = isPaper ? 'MMDDYY' : 'MM/DD/YY hh:mm a';
  return docketEntryEntity.createdAt
    ? applicationContext
        .getUtilities()
        .formatDateString(docketEntryEntity.createdAt, formatString)
    : '';
};

/**
 * a helper function which assembles the correct data to be used in the generation of a PDF
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.docketEntryEntity the docket entry entity we are creating the cover for
 * @param {boolean} options.useInitialData whether to use the initial docket record suffix and case caption
 * @returns {object} the key/value pairs of computed strings
 */
exports.generateCoverSheetData = ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  filingDateUpdated,
  useInitialData,
}) => {
  const isLodged = docketEntryEntity.lodged;
  const { certificateOfService, isPaper } = docketEntryEntity;
  const { formatDateString } = applicationContext.getUtilities();

  const dateServedFormatted = docketEntryEntity.servedAt
    ? formatDateString(docketEntryEntity.servedAt, 'MMDDYY')
    : '';

  let dateReceivedFormatted = formatDateReceived({
    applicationContext,
    docketEntryEntity,
    isPaper,
  });

  const dateFiledFormatted = docketEntryEntity.filingDate
    ? formatDateString(docketEntryEntity.filingDate, 'MMDDYY')
    : '';

  const caseCaptionToUse = useInitialData
    ? caseEntity.initialCaption
    : caseEntity.caseCaption;

  const docketNumberSuffixToUse = useInitialData
    ? caseEntity.initialDocketNumberSuffix.replace('_', '')
    : caseEntity.docketNumberSuffix;

  const caseCaption = caseCaptionToUse || Case.getCaseCaption(caseEntity);
  let caseTitle = applicationContext.getCaseTitle(caseCaption);
  let caseCaptionExtension = '';
  if (caseTitle !== caseCaption) {
    caseTitle += ', ';
    caseCaptionExtension = caseCaption.replace(caseTitle, '');
  }

  let documentTitle =
    docketEntryEntity.documentTitle || docketEntryEntity.documentType;
  if (docketEntryEntity.additionalInfo && docketEntryEntity.addToCoversheet) {
    documentTitle += ` ${docketEntryEntity.additionalInfo}`;
  }

  const docketNumberWithSuffix =
    caseEntity.docketNumber + (docketNumberSuffixToUse || '');

  let coverSheetData = {
    caseCaptionExtension,
    caseTitle,
    certificateOfService,
    dateFiledLodged: dateFiledFormatted,
    dateFiledLodgedLabel: isLodged ? 'Lodged' : 'Filed',
    dateReceived: filingDateUpdated
      ? dateFiledFormatted
      : dateReceivedFormatted,
    dateServed: dateServedFormatted,
    docketNumberWithSuffix,
    documentTitle,
    electronicallyFiled: !docketEntryEntity.isPaper,
    mailingDate: docketEntryEntity.mailingDate || '',
  };

  if (
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      docketEntryEntity.eventCode,
    )
  ) {
    coverSheetData = omit(coverSheetData, [
      'dateReceived',
      'electronicallyFiled',
      'dateServed',
    ]);
  }

  return coverSheetData;
};
/**
 * a helper function which creates a coversheet, prepends it to a pdf, and returns the new pdf
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {string} options.caseEntity the case entity associated with the document we are creating the cover for
 * @param {object} options.docketEntryEntity the docket entry entity we are creating the cover for
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with a coversheet attached
 */
exports.addCoverToPdf = async ({
  applicationContext,
  caseEntity,
  docketEntryEntity,
  filingDateUpdated = false,
  pdfData,
  replaceCoversheet = false,
  useInitialData = false,
}) => {
  const coverSheetData = exports.generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    useInitialData,
  });

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);

  // allow GC to clear original loaded pdf data
  pdfData = null;

  const coverPagePdf = await applicationContext
    .getDocumentGenerators()
    .coverSheet({
      applicationContext,
      data: coverSheetData,
    });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);
  const coverPageDocumentPages = await pdfDoc.copyPages(
    coverPageDocument,
    coverPageDocument.getPageIndices(),
  );

  if (replaceCoversheet) {
    pdfDoc.removePage(0);
    pdfDoc.insertPage(0, coverPageDocumentPages[0]);
  } else {
    pdfDoc.insertPage(0, coverPageDocumentPages[0]);
  }

  const newPdfData = await pdfDoc.save();
  const numberOfPages = pdfDoc.getPages().length;

  return {
    numberOfPages,
    pdfData: newPdfData,
  };
};

/**
 * addCoversheetInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @param {string} providers.docketNumber the docket number of the case
 * @param {boolean} providers.filingDateUpdated flag that represents if the filing date was updated
 * @param {boolean} providers.replaceCoversheet flag that represents if the coversheet should be replaced
 * @param {boolean} providers.useInitialData flag that represents to use initial data
 * @returns {Promise<*>} updated docket entry entity
 */
exports.addCoversheetInteractor = async (
  applicationContext,
  {
    caseEntity = null,
    docketEntryId,
    docketNumber,
    filingDateUpdated = false,
    replaceCoversheet = false,
    useInitialData = false,
  },
) => {
  if (!caseEntity) {
    const caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    caseEntity = new Case(caseRecord, { applicationContext });
  }

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  let pdfData;
  try {
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();
    pdfData = Body;
  } catch (err) {
    err.message = `${err.message} docket entry id is ${docketEntryId}`;
    throw err;
  }

  const { numberOfPages, pdfData: newPdfData } = await exports.addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    pdfData,
    replaceCoversheet,
    useInitialData,
  });

  docketEntryEntity.setAsProcessingStatusAsCompleted();
  docketEntryEntity.setNumberOfPages(numberOfPages);

  const updatedDocketEntryEntity = docketEntryEntity.validate();

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber: caseEntity.docketNumber,
    document: updatedDocketEntryEntity.toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: docketEntryId,
  });

  return updatedDocketEntryEntity;
};
