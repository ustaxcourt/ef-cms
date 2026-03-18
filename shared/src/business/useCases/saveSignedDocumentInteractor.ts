import { Case } from '@shared/business/entities/cases/Case';
import {
  ACTION_DOCUMENT_TYPE_OPTIONS,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SIGNED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Message } from '@shared/business/entities/Message';
import { NotFoundError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { orderBy } from 'lodash';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';

const saveOriginalDocumentWithNewId = async ({
  applicationContext,
  originalDocumentStorageId,
}) => {
  const originalDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: originalDocumentStorageId,
      useTempBucket: false,
    });

  const documentIdBeforeSignature = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: originalDocument,
    key: documentIdBeforeSignature,
  });

  return documentIdBeforeSignature;
};

const replaceOriginalWithSignedDocument = async ({
  applicationContext,
  originalDocumentStorageId,
  signedDocumentStorageId,
}) => {
  const signedDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: signedDocumentStorageId,
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: signedDocument,
    key: originalDocumentStorageId,
  });
};

export const saveSignedDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketNumber,
    nameForSigning,
    originalDocketEntryId,
    parentMessageId,
    signedDocumentStorageId,
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ signedDocketEntryId: string }> => {
  if (!isAuthUser(authorizedUser)) {
    throw new Error(
      'User attempting to save signed document is not an auth user',
    );
  }
  const caseRecord = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!caseRecord) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  const caseEntity = new Case(caseRecord, { authorizedUser });
  const originalDocketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId: originalDocketEntryId,
  });

  let signedDocketEntryEntity: DocketEntry;
  if (
    originalDocketEntryEntity?.documentType ===
    ACTION_DOCUMENT_TYPE_OPTIONS.proposedStipulatedDecision
  ) {
    signedDocketEntryEntity = new DocketEntry(
      {
        createdAt: applicationContext.getUtilities().createISODateString(),
        docketEntryId: signedDocumentStorageId,
        documentStorageId: signedDocumentStorageId,
        docketNumber: caseRecord.docketNumber,
        documentTitle:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        documentType:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
        filedBy: originalDocketEntryEntity.filedBy,
        isDraft: true,
        isFileAttached: true,
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
      { authorizedUser },
    );

    signedDocketEntryEntity.setFiledBy(authorizedUser);

    signedDocketEntryEntity.setSigned(authorizedUser?.userId, nameForSigning);

    caseEntity.addDocketEntry(signedDocketEntryEntity);

    if (parentMessageId) {
      const messages = await getMessageThreadByParentId({
        parentMessageId,
      });

      const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

      const messageEntity = new Message(mostRecentMessage).validate();
      messageEntity.addAttachment({
        documentId: signedDocketEntryEntity.docketEntryId,
        documentTitle: signedDocketEntryEntity.documentTitle,
      });

      await upsertMessages([messageEntity.validate().toRawObject()]);
    }
  } else {
    const documentIdBeforeSignature = await saveOriginalDocumentWithNewId({
      applicationContext,
      originalDocumentStorageId: originalDocketEntryEntity?.documentStorageId,
    });

    await replaceOriginalWithSignedDocument({
      applicationContext,
      originalDocumentStorageId: originalDocketEntryEntity?.documentStorageId,
      signedDocumentStorageId,
    });

    signedDocketEntryEntity = new DocketEntry(
      {
        ...originalDocketEntryEntity,
        createdAt: applicationContext.getUtilities().createISODateString(),
        documentIdBeforeSignature,
        isFileAttached: true,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
      },
      { authorizedUser },
    );

    signedDocketEntryEntity.setFiledBy(authorizedUser);

    signedDocketEntryEntity.setSigned(authorizedUser?.userId, nameForSigning);

    caseEntity.updateDocketEntry(signedDocketEntryEntity);
  }

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return {
    signedDocketEntryId: signedDocketEntryEntity.docketEntryId,
  };
};
