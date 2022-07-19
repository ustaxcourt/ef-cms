const { COURT_ISSUED_EVENT_CODES } = require('../entities/EntityConstants');
const { DocketEntry } = require('../entities/DocketEntry');
/**
 *
 * Add docket entry for draft stamp order
 * generates the order and uploads to s3
 * saves documentContents
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Case} providers.caseEntity the caseEntity
 * @param {string} providers.orderPdfData the order pdf data
 */
exports.addDocketEntryForDraftStampOrder = async ({
  applicationContext,
  caseEntity,
  orderPdfData,
}) => {
  const user = applicationContext.getCurrentUser();

  const orderDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'O',
  );

  const newDocketEntry = new DocketEntry(
    {
      documentTitle: 'Order',
      documentType: orderDocumentInfo.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: 'Order',
        documentType: orderDocumentInfo.documentType,
        eventCode: orderDocumentInfo.eventCode,
      },
      eventCode: orderDocumentInfo.eventCode,
      isDraft: true,
      userId: user.userId,
    },
    { applicationContext },
  );

  caseEntity.addDocketEntry(newDocketEntry);

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: Buffer.from(new Uint8Array(orderPdfData)),
    pdfName: newDocketEntry.docketEntryId,
  });

  const documentContentsId = applicationContext.getUniqueId();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    contentType: 'application/json',
    document: Buffer.from(new Uint8Array(orderPdfData)),
    key: documentContentsId,
    useTempBucket: false,
  });

  newDocketEntry.documentContentsId = documentContentsId;

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};
