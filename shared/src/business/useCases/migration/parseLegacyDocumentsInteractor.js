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
    err.message = `${err.message} docket entry id is ${docketEntryId}`;
    throw err;
  }

  console.log(
    `..........docketEntry with : ${docketEntryId} in ${applicationContext.environment.documentsBucketName} was ${pdfBuffer}`,
  );

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

  const arrayBuffer = new ArrayBuffer(pdfBuffer.length);

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
