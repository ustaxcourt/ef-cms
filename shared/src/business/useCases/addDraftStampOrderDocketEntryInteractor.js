const {
  COURT_ISSUED_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');

/**
 * addDraftStampOrderDocketEntryInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.formattedDraftDocumentTitle the formatted draft document title of the document
 * @param {string} providers.originalDocketEntryId the id of the original (un-stamped) document
 * @param {string} providers.stampedDocketEntryId the id of the stamped document
 * @param {string} providers.stampData the stampData from the form
 */
exports.addDraftStampOrderDocketEntryInteractor = async (
  applicationContext,
  {
    docketNumber,
    formattedDraftDocumentTitle,
    originalDocketEntryId,
    stampData,
    stampedDocketEntryId,
  },
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
      docketEntryId: stampedDocketEntryId,
      docketNumber: caseRecord.docketNumber,
      documentTitle: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      documentType: orderDocumentInfo.documentType,
      draftOrderState: {
        docketNumber: caseEntity.docketNumber,
        documentTitle: formattedDraftDocumentTitle,
        documentType: orderDocumentInfo.documentType,
        eventCode: orderDocumentInfo.eventCode,
        freeText: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      },
      eventCode: orderDocumentInfo.eventCode,
      filedBy: originalDocketEntryEntity.filedBy,
      freeText: `${originalDocketEntryEntity.documentType} ${formattedDraftDocumentTitle}`,
      isDraft: true,
      isPaper: false,
      processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      stampData,
      userId: user.userId,
    },
    { applicationContext },
  );

  signedDocketEntryEntity.setSigned(user.userId, stampData.nameForSigning);

  caseEntity.addDocketEntry(signedDocketEntryEntity);

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });
};
