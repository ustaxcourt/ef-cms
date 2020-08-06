const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SIGNED_DOCUMENT_TYPES,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { CaseMessage } = require('../entities/CaseMessage');
const { Document } = require('../entities/Document');
const { orderBy } = require('lodash');

const saveOriginalDocumentWithNewId = async ({
  applicationContext,
  originalDocumentId,
}) => {
  const originalDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: originalDocumentId,
      protocol: 'S3',
      useTempBucket: false,
    });

  const documentIdBeforeSignature = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalDocument,
    documentId: documentIdBeforeSignature,
  });

  return documentIdBeforeSignature;
};

const replaceOriginalWithSignedDocument = async ({
  applicationContext,
  originalDocumentId,
  signedDocumentId,
}) => {
  const signedDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: signedDocumentId,
      protocol: 'S3',
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: signedDocument,
    documentId: originalDocumentId,
  });
};

const saveOriginalDocumentWithNewId = async ({
  applicationContext,
  originalDocumentId,
}) => {
  const originalDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: originalDocumentId,
      protocol: 'S3',
      useTempBucket: false,
    });

  const documentIdBeforeSignature = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: originalDocument,
    documentId: documentIdBeforeSignature,
  });

  return documentIdBeforeSignature;
};

const replaceOriginalWithSignedDocument = async ({
  applicationContext,
  originalDocumentId,
  signedDocumentId,
}) => {
  const signedDocument = await applicationContext
    .getPersistenceGateway()
    .getDocument({
      applicationContext,
      documentId: signedDocumentId,
      protocol: 'S3',
      useTempBucket: false,
    });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: signedDocument,
    documentId: originalDocumentId,
  });
};

/**
 * saveSignedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case on which to save the document
 * @param {string} providers.nameForSigning the name on the signature of the signed document
 * @param {string} providers.originalDocumentId the id of the original (unsigned) document
 * @param {string} providers.parentMessageId the id of the parent message to add the signed document to
 * @param {string} providers.signedDocumentId the id of the signed document
 * @returns {object} the updated case
 */
exports.saveSignedDocumentInteractor = async ({
  applicationContext,
  docketNumber,
  nameForSigning,
  originalDocumentId,
  parentMessageId,
  signedDocumentId,
}) => {
  const user = applicationContext.getCurrentUser();
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });
  const caseEntity = new Case(caseRecord, { applicationContext });
  const originalDocumentEntity = caseEntity.documents.find(
    document => document.documentId === originalDocumentId,
  );

  const documentIdBeforeSignature = await saveOriginalDocumentWithNewId({
    applicationContext,
    originalDocumentId,
  });

  await replaceOriginalWithSignedDocument({
    applicationContext,
    originalDocumentId,
    signedDocumentId,
  });

  let signedDocumentEntity;
  if (originalDocumentEntity.documentType === 'Proposed Stipulated Decision') {
    signedDocumentEntity = new Document(
      {
        createdAt: applicationContext.getUtilities().createISODateString(),
        documentId: signedDocumentId,
        documentTitle:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        documentType:
          SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.documentType,
        eventCode: SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
        filedBy: originalDocumentEntity.filedBy,
        isDraft: true,
        isPaper: false,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId: user.userId,
      },
      { applicationContext },
    );

    signedDocumentEntity.setSigned(user.userId, nameForSigning);

    caseEntity.addDocumentWithoutDocketRecord(signedDocumentEntity);

    if (parentMessageId) {
      const messages = await applicationContext
        .getPersistenceGateway()
        .getCaseMessageThreadByParentId({
          applicationContext,
          parentMessageId: parentMessageId,
        });

      const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

      const caseMessageEntity = new CaseMessage(mostRecentMessage, {
        applicationContext,
      }).validate();
      caseMessageEntity.addAttachment({
        documentId: signedDocumentEntity.documentId,
        documentTitle: signedDocumentEntity.documentTitle,
      });

      await applicationContext.getPersistenceGateway().updateCaseMessage({
        applicationContext,
        caseMessage: caseMessageEntity.validate().toRawObject(),
      });
    }
  } else {
    const documentIdBeforeSignature = await saveOriginalDocumentWithNewId({
      applicationContext,
      originalDocumentId,
    });

    await replaceOriginalWithSignedDocument({
      applicationContext,
      originalDocumentId,
      signedDocumentId,
    });

    signedDocumentEntity = new Document(
      {
        ...originalDocumentEntity,
        createdAt: applicationContext.getUtilities().createISODateString(),
        documentIdBeforeSignature,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        userId: user.userId,
      },
      { applicationContext },
    );

    signedDocumentEntity.setSigned(user.userId, nameForSigning);
    caseEntity.updateDocument(signedDocumentEntity);
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity;
};
