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
  let pdfBuffer;
  try {
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();
    pdfBuffer = Body;
  } catch (err) {
    throw new Error('Docket entry document not found in S3.');
  }

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

  const pdfTextContents = await applicationContext
    .getUseCaseHelpers()
    .parseAndScrapePdfContents({ applicationContext, pdfBuffer });

  const documentContentsId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: Buffer.from(
      JSON.stringify({ documentContents: pdfTextContents }),
    ),
    key: documentContentsId,
  });

  foundDocketEntry.documentContentsId = documentContentsId;

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });
};
