const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SIGNED_DOCUMENT_TYPES,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { Message } = require('../entities/Message');
const { orderBy } = require('lodash');

const saveOriginalDocumentWithNewId = async ({
  applicationContext,
  originalDocketEntryId,
}) => {
  const originalDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      key: originalDocketEntryId,
      protocol: 'S3',
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
      protocol: 'S3',
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
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.nameForSigning the name on the signature of the signed document
 * @param {string} providers.originalDocketEntryId the id of the original (unsigned) document
 * @param {string} providers.parentMessageId the id of the parent message to add the signed document to
 * @param {string} providers.signedDocketEntryId the id of the signed document
 * @returns {object} an object containing the updated caseEntity and the signed document ID
 */
exports.saveSignedDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  nameForSigning,
  originalDocketEntryId,
  parentMessageId,
  signedDocketEntryId,
}) => {
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
        documentTitle:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        documentType:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
        filedBy: originalDocketEntryEntity.filedBy,
        isDraft: true,
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId: user.userId,
      },
      { applicationContext },
    );

    signedDocketEntryEntity.setSigned(user.userId, nameForSigning);

    caseEntity.addDocketEntry(signedDocketEntryEntity);

    if (parentMessageId) {
      const messages = await applicationContext
        .getPersistenceGateway()
        .getMessageThreadByParentId({
          applicationContext,
          parentMessageId: parentMessageId,
        });

      const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

      const messageEntity = new Message(mostRecentMessage, {
        applicationContext,
      }).validate();
      messageEntity.addAttachment({
        documentId: signedDocketEntryEntity.docketEntryId,
        documentTitle: signedDocketEntryEntity.documentTitle,
      });

      await applicationContext.getPersistenceGateway().updateMessage({
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
        userId: user.userId,
      },
      { applicationContext },
    );

    signedDocketEntryEntity.setSigned(user.userId, nameForSigning);
    caseEntity.updateDocketEntry(signedDocketEntryEntity);
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return {
    caseEntity,
    signedDocketEntryId: signedDocketEntryEntity.docketEntryId,
  };
};
