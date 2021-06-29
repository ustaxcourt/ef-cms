const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
} = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { omit } = require('lodash');

const addNewInitialFilingToCase = ({
  applicationContext,
  authorizedUser,
  caseEntity,
  currentCaseDocument,
  documentType,
  originalCaseDocument,
}) => {
  let documentMeta;

  if (originalCaseDocument) {
    documentMeta = {
      ...originalCaseDocument,
      ...currentCaseDocument,
    };
  } else {
    const { eventCode } = Object.values(INITIAL_DOCUMENT_TYPES).find(
      dt => dt.documentType === documentType,
    );

    const contactSecondary = caseEntity.getContactSecondary();

    const filers = [caseEntity.getContactPrimary().contactId];
    if (contactSecondary && contactSecondary.name) {
      filers.push(contactSecondary.contactId);
    }

    documentMeta = {
      ...currentCaseDocument,
      createdAt: caseEntity.receivedAt,
      eventCode,
      filers,
      filingDate: caseEntity.receivedAt,
      isFileAttached: true,
      isOnDocketRecord: true,
      isPaper: true,
      mailingDate: caseEntity.mailingDate,
      receivedAt: caseEntity.receivedAt,
      userId: authorizedUser.userId,
    };
  }

  const documentToAdd = new DocketEntry(documentMeta, {
    applicationContext,
    petitioners: caseEntity.petitioners,
  });

  caseEntity.addDocketEntry(documentToAdd);
};

const deleteInitialFilingFromCase = async ({
  applicationContext,
  caseEntity,
  originalCaseDocument,
}) => {
  caseEntity.deleteDocketEntryById({
    docketEntryId: originalCaseDocument.docketEntryId,
  });

  await applicationContext.getPersistenceGateway().deleteDocketEntry({
    applicationContext,
    docketEntryId: originalCaseDocument.docketEntryId,
    docketNumber: caseEntity.docketNumber,
  });

  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key: originalCaseDocument.docketEntryId,
  });
};

/**
 * updateInitialFilingDocuments
 *
 * @param {object} providers providers object
 * @param {object} providers.applicationContext application context object
 * @param {object} providers.authorizedUser authorized user object
 * @param {object} providers.caseEntity case entity
 * @param {object} providers.caseToUpdate case to update
 * @returns {void}
 */
exports.updateInitialFilingDocuments = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  caseToUpdate,
}) => {
  const initialDocumentTypesWithoutPetition = omit(
    INITIAL_DOCUMENT_TYPES_MAP,
    'petitionFile',
  );

  for (const key of Object.keys(initialDocumentTypesWithoutPetition)) {
    const documentType = INITIAL_DOCUMENT_TYPES_MAP[key];
    const originalCaseDocument = caseEntity.docketEntries.find(
      doc => doc.documentType === documentType,
    );
    const currentCaseDocument = caseToUpdate.docketEntries.find(
      doc => doc.documentType === documentType,
    );

    if (originalCaseDocument && currentCaseDocument) {
      if (
        originalCaseDocument.docketEntryId !== currentCaseDocument.docketEntryId
      ) {
        addNewInitialFilingToCase({
          applicationContext,
          caseEntity,
          currentCaseDocument,
          originalCaseDocument,
        });
        await deleteInitialFilingFromCase({
          applicationContext,
          caseEntity,
          originalCaseDocument,
        });
      }
    } else if (!originalCaseDocument && currentCaseDocument) {
      addNewInitialFilingToCase({
        applicationContext,
        authorizedUser,
        caseEntity,
        currentCaseDocument,
        documentType,
      });
    } else if (originalCaseDocument && !currentCaseDocument) {
      await deleteInitialFilingFromCase({
        applicationContext,
        caseEntity,
        originalCaseDocument,
      });
    }
  }
};
