const { Case } = require('../entities/cases/Case');
const { generateCoverSheetData } = require('./generateCoverSheetData');

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
  stampData,
}) => {
  const coverSheetData = await generateCoverSheetData({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    stampData,
  });

  const { PDFDocument } = await applicationContext.getPdfLib();

  const coverPagePdf = await applicationContext
    .getDocumentGenerators()
    .coverSheet({
      applicationContext,
      data: coverSheetData,
    });

  const coverPageDocument = await PDFDocument.load(coverPagePdf);
  console.log('coverpage length', coverPageDocument.getPages().length);

  const newPdfData = await coverPageDocument.save();

  return {
    pdfData: newPdfData,
  };
};

/**
 * generateStampedCoversheetInteractor
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
exports.generateStampedCoversheetInteractor = async (
  applicationContext,
  {
    caseEntity = null,
    docketEntryId,
    docketNumber,
    stampData,
    stampedDocketEntryId,
  },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  caseEntity = new Case(caseRecord, { applicationContext });

  const motionDocketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  const { pdfData: newPdfData } = await exports.addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity: motionDocketEntryEntity,
    stampData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: stampedDocketEntryId,
  });
};
