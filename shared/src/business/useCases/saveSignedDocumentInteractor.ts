import { Case } from '../entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SIGNED_DOCUMENT_TYPES,
} from '../entities/EntityConstants';
import { DocketEntry } from '../entities/DocketEntry';
import { Message } from '../entities/Message';
import { orderBy } from 'lodash';

const saveOriginalDocumentWithNewId = async ({
  applicationContext,
  originalDocketEntryId,
}) => {
  const originalDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: originalDocketEntryId,
      useTempBucket: false,
    });

  const documentIdBeforeSignature = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalDocument,
    key: documentIdBeforeSignature,
  });

  return documentIdBeforeSignature;
};

const replaceOriginalWithSignedDocument = async ({
  applicationContext,
  originalDocketEntryId,
  signedDocketEntryId,
}) => {
  const signedDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: signedDocketEntryId,
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: signedDocument,
    key: originalDocketEntryId,
  });
};

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.nameForSigning the name on the signature of the signed document
 * @param {string} providers.originalDocketEntryId the id of the original (unsigned) document
 * @param {string} providers.parentMessageId the id of the parent message to add the signed document to
 * @param {string} providers.signedDocketEntryId the id of the signed document
 * @returns {object} an object containing the updated caseEntity and the signed document ID
 */
export const saveSignedDocumentInteractor = async (
  applicationContext,
  {
    docketNumber,
    nameForSigning,
    originalDocketEntryId,
    parentMessageId,
    signedDocketEntryId,
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
  if (
    originalDocketEntryEntity.documentType === 'Proposed Stipulated Decision'
  ) {
    signedDocketEntryEntity = new DocketEntry(
      {
        createdAt: applicationContext.getUtilities().createISODateString(),
        docketEntryId: signedDocketEntryId,
        docketNumber: caseRecord.docketNumber,
        documentTitle:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        documentType:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
        filedBy: originalDocketEntryEntity.filedBy,
        isDraft: true,
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
      { applicationContext },
    );

    signedDocketEntryEntity.setFiledBy(user);

    signedDocketEntryEntity.setSigned(user.userId, nameForSigning);

    caseEntity.addDocketEntry(signedDocketEntryEntity);

    if (parentMessageId) {
      const messages = await applicationContext
        .getPersistenceGateway()
        .getMessageThreadByParentId({
          applicationContext,
          parentMessageId,
        });

      const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

      const messageEntity = new Message(mostRecentMessage, {
        applicationContext,
      }).validate();
      messageEntity.addAttachment({
        documentId: signedDocketEntryEntity.docketEntryId,
        documentTitle: signedDocketEntryEntity.documentTitle,
      });

      await applicationContext.getPersistenceGateway().upsertMessage({
        applicationContext,
        message: messageEntity.validate().toRawObject(),
      });
    }
  } else {
    const documentIdBeforeSignature = await saveOriginalDocumentWithNewId({
      applicationContext,
      originalDocketEntryId,
    });

    await replaceOriginalWithSignedDocument({
      applicationContext,
      originalDocketEntryId,
      signedDocketEntryId,
    });

    signedDocketEntryEntity = new DocketEntry(
      {
        ...originalDocketEntryEntity,
        createdAt: applicationContext.getUtilities().createISODateString(),
        documentIdBeforeSignature,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
      { applicationContext },
    );

    signedDocketEntryEntity.setFiledBy(user);

    signedDocketEntryEntity.setSigned(user.userId, nameForSigning);

    caseEntity.updateDocketEntry(signedDocketEntryEntity);
  }

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntity,
  });

  return {
    caseEntity,
    signedDocketEntryId: signedDocketEntryEntity.docketEntryId,
  };
};
