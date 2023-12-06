import { DocketEntry } from '../../entities/DocketEntry';
import {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
} from '../../entities/EntityConstants';
import { omit } from 'lodash';

const addNewInitialFilingToCase = ({
  applicationContext,
  authorizedUser,
  caseEntity,
  currentCaseDocument,
  documentType,
  originalCaseDocument,
}) => {
  let documentToAdd: DocketEntry;

  if (originalCaseDocument) {
    documentToAdd = new DocketEntry(
      {
        ...originalCaseDocument,
        ...currentCaseDocument,
      },
      {
        applicationContext,
        petitioners: caseEntity.petitioners,
      },
    );
  } else {
    const { eventCode } = Object.values(INITIAL_DOCUMENT_TYPES).find(
      dt => dt.documentType === documentType,
    );

    const contactSecondary = caseEntity.getContactSecondary();

    const filers = [caseEntity.getContactPrimary().contactId];
    if (contactSecondary && contactSecondary.name) {
      filers.push(contactSecondary.contactId);
    }

    documentToAdd = new DocketEntry(
      {
        ...currentCaseDocument,
        createdAt: caseEntity.receivedAt,
        eventCode,
        filers,
        filingDate: caseEntity.receivedAt,
        isFileAttached: true,
        isOnDocketRecord: eventCode !== INITIAL_DOCUMENT_TYPES.stin.eventCode,
        isPaper: true,
        mailingDate: caseEntity.mailingDate,
        receivedAt: caseEntity.receivedAt,
      },
      {
        applicationContext,
        petitioners: caseEntity.petitioners,
      },
    );

    documentToAdd.setFiledBy(authorizedUser);
  }

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

  await applicationContext.getPersistenceGateway().deleteDocumentFile({
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
export const updateInitialFilingDocuments = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
  caseToUpdate,
}) => {
  const PETITION_KEY = 'petitionFile';
  const initialDocumentTypesWithoutPetition = omit(
    INITIAL_DOCUMENT_TYPES_MAP,
    PETITION_KEY,
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
