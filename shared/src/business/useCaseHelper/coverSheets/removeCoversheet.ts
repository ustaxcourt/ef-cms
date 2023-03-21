const { Case } = require('../../entities/cases/Case');

/**
 * a helper function which removes a coversheet from a pdf and returns the new pdf data
 *
 * @param {object} options the providers object
 * @param {object} options.applicationContext the application context
 * @param {object} options.pdfData the original document pdf data
 * @returns {object} the new pdf with coversheet removed
 */
exports.removeCoverFromPdf = async ({ applicationContext, pdfData }) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);

  pdfDoc.removePage(0);

  const newPdfData = await pdfDoc.save();
  const numberOfPages = pdfDoc.getPages().length;

  return {
    numberOfPages,
    pdfData: newPdfData,
  };
};

/**
 * removeCoversheet
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} updated docket entry entity
 */
exports.removeCoversheet = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

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

  const { numberOfPages, pdfData: newPdfData } =
    await exports.removeCoverFromPdf({
      applicationContext,
      pdfData,
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
