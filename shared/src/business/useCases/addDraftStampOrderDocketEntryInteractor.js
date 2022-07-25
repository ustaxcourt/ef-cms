const {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');

/**
 * saveStampedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.nameForSigning the name on the signature of the signed document
 * @param {string} providers.originalDocketEntryId the id of the original (unsigned) document
 * @param {string} providers.signedDocketEntryId the id of the signed document
 */
exports.addDraftStampOrderDocketEntryInteractor = async (
  applicationContext,
  { docketNumber, originalDocketEntryId, signedDocketEntryId, stampData },
) => {
  const user = applicationContext.getCurrentUser();
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
  const originalDocketEntryEntity = caseEntity.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === originalDocketEntryId,
  );

  let signedDocketEntryEntity;
  const orderDocumentInfo = COURT_ISSUED_EVENT_CODES.find(
    doc => doc.eventCode === 'O',
  );

  signedDocketEntryEntity = new DocketEntry(
    {
      createdAt: applicationContext.getUtilities().createISODateString(),
      docketEntryId: signedDocketEntryId,
      docketNumber: caseRecord.docketNumber,
      documentTitle: 'Order',
      documentType: orderDocumentInfo.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: 'Order',
        documentType: orderDocumentInfo.documentType,
        eventCode: orderDocumentInfo.eventCode,
      },
      eventCode: orderDocumentInfo.eventCode,
      filedBy: originalDocketEntryEntity.filedBy,
      isDraft: true,
      isPaper: false,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      userId: user.userId,
    },
    { applicationContext },
  );

  signedDocketEntryEntity.setStamped(stampData);
  signedDocketEntryEntity.setSigned(user.userId, stampData.nameForSigning);

  caseEntity.addDocketEntry(signedDocketEntryEntity);

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};
