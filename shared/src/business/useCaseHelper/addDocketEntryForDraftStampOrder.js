const { COURT_ISSUED_EVENT_CODES } = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
/**
 *
 * Add docket entry for draft stamp order
 * generates the order and uploads to s3
 * saves documentContents and richText for editing the order
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Case} providers.caseEntity the caseEntity
 * @param {string} providers.systemGeneratedDocument the systemGeneratedDocument
 */
exports.addDocketEntryForDraftStampOrder = async ({
  applicationContext,
  caseEntity,
  orderPdfData,
  systemGeneratedDocument: draftStampOrder,
}) => {
  const user = applicationContext.getCurrentUser();

  const orderDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'O',
  );

  //make sure title is generated correctly
  const newDocketEntry = new DocketEntry(
    {
      documentTitle: orderDocumentInfo.documentTitle,
      documentType: orderDocumentInfo.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: orderDocumentInfo.documentTitle,
        documentType: orderDocumentInfo.documentType,
        eventCode: orderDocumentInfo.eventCode,
      },
      eventCode: draftStampOrder.eventCode,
      isDraft: true,
      userId: user.userId,
    },
    { applicationContext },
  );

  caseEntity.addDocketEntry(newDocketEntry);

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: orderPdfData,
    pdfName: newDocketEntry.docketEntryId,
  });

  const documentContentsId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    contentType: 'application/json',
    document: Buffer.from(JSON.stringify(orderPdfData)),
    key: documentContentsId,
    useTempBucket: false,
  });

  newDocketEntry.documentContentsId = documentContentsId;

  return await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });
};
