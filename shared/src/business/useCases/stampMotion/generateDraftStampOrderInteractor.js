const { Case } = require('../../entities/cases/Case');

/**
 * @param {object} providers the providers object containing applicationContext, caseEntity, document, replacements
 * @param {object} providers.applicationContext api applicationContext
 * @param {Case} providers.caseEntity the case to create a new document for
 * @param {object} providers.document a document similar to those defined in SYSTEM_GENERATED_DOCUMENT_TYPES in EntityConstants.js (i.e. must have the same properties)
 * @param {string[]} providers.replacements an ordered array of strings that replace bracketed placeholders in providers.document.content
 * @returns {Promise<void>} does not return anything, rather creates a document and associated docket entry
 */
const generateDraftStampOrderInteractor = async (
  applicationContext,
  { docketEntryId, docketNumber },
) => {
  console.log('------', docketEntryId, docketNumber);
  //grab coversheet
  //create draft docket entry for order
  //use coversheet to create order document and save to s3
  //add draft doc to case.docket entries
  //save case
  let pdfData = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  pdfData = pdfData.Body;
  const { PDFDocument } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);
  const coversheet = pdfDoc.getPages()[0];

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseDetail, {
    applicationContext,
  });
  await applicationContext
    .getUseCaseHelpers()
    .addDocketEntryForDraftStampOrder({
      applicationContext,
      caseEntity,
      docketNumber,
      orderPdfData: coversheet,
    });
};

module.exports = {
  generateDraftStampOrderInteractor,
};
