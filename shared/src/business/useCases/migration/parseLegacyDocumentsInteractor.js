const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');

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
    // Finding the PDF in the S3 Bucket
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();
    pdfBuffer = Body;
  } catch (err) {
    throw new Error(
      `Docket entry document not found in S3. ${docketNumber} ${docketEntryId}`,
    );
  }

  // Gets the case by Docket Number, to find the Docket Entry
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
  const foundDocketEntry = caseEntity.getDocketEntryById({ docketEntryId });

  if (!foundDocketEntry) {
    throw new Error(`Docket entry not found. ${docketNumber} ${docketEntryId}`);
  }

  // Scrape the contents of the PDF
  let pdfTextContents;
  try {
    pdfTextContents = await applicationContext
      .getUseCaseHelpers()
      .parseAndScrapePdfContents({ applicationContext, pdfBuffer });
  } catch (err) {
    throw new Error(
      `Error scraping PDF contents. ${docketNumber} ${docketEntryId}; ${err.message}`,
    );
  }

  const documentContentsId = applicationContext.getUniqueId();

  try {
    // Save text contents to JSON file in S3
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      contentType: 'application/json',
      document: Buffer.from(
        JSON.stringify({ documentContents: pdfTextContents }),
      ),
      key: documentContentsId,
    });
  } catch (err) {
    throw new Error(
      `Error Saving contents to S3: ${docketNumber} ${docketEntryId}; ${err.message}`,
    );
  }

  foundDocketEntry.documentContentsId = documentContentsId;

  const validatedDocketEntry = new DocketEntry(foundDocketEntry, {
    applicationContext,
  }).validate();

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId: foundDocketEntry.docketEntryId,
    docketNumber: caseEntity.docketNumber,
    document: validatedDocketEntry,
  });
  applicationContext.logger.info(
    `Successfully scraped ${docketNumber}: ${docketEntryId}`,
  );
};
