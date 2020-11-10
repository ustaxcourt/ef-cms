const { Case } = require('../../entities/cases/Case');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketEntryId the docketEntryId
 * @param {object} providers.docketNumber the docketNumber
 */
exports.parseLegacyDocumentsInteractor = async ({
  applicationContext,
  docketEntryId,
  docketNumber,
}) => {
  const { Body: pdfBuffer } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });

  const foundDocketEntry = caseEntity.getDocketEntryById({ docketEntryId });

  if (!foundDocketEntry) {
    throw new Error('Docket entry not found.');
  }

  // TODO - refactor as part of DOD to utility function
  const arrayBuffer = new ArrayBuffer(pdfBuffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < pdfBuffer.length; ++i) {
    view[i] = pdfBuffer[i];
  }

  const pdfTextContents = await applicationContext
    .getUtilities()
    .scrapePdfContents({ applicationContext, pdfBuffer: arrayBuffer });

  const documentContentsId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: Buffer.from(JSON.stringify(pdfTextContents)),
    key: documentContentsId,
  });

  foundDocketEntry.documentContentsId = documentContentsId;

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
