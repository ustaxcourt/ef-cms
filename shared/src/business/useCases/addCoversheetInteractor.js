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
  filingDateUpdated,
  pdfData,
  replaceCoversheet = false,
  useInitialData,
}) => {
  const coverSheetData = await generateCoverSheetData({
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
    filingDateUpdated,
    replaceCoversheet,
    useInitialData,
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
