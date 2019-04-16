const { Case } = require('../../entities/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');

const {
  isAuthorized,
  FILE_EXTERNAL_DOCUMENT,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param documentMetadata
 * @param primaryDocumentFileId
 * @param secondaryDocumentFileId
 * @param supportingDocumentFileId
 * @param secondarySupportingDocumentFileId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileExternalDocument = async ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
  secondaryDocumentFileId,
  secondarySupportingDocumentFileId,
  supportingDocumentFileId,
}) => {
  const user = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(user, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate);

  [
    [primaryDocumentFileId, documentMetadata],
    [supportingDocumentFileId, documentMetadata.supportingDocumentMetadata],
    [secondaryDocumentFileId, documentMetadata.secondaryDocument],
    [
      secondarySupportingDocumentFileId,
      documentMetadata.secondarySupportingDocumentMetadata,
    ],
  ].forEach(([documentId, metadata]) => {
    if (documentId) {
      const documentEntity = new Document({
        documentId: documentId,
        documentType: metadata.documentType,
        userId: user.userId,
      });

      caseEntity.addDocumentWithoutDocketRecord(documentEntity);

      caseEntity.addDocketRecord(
        new DocketRecord({
          description: metadata.documentTitle,
          documentId: documentEntity.documentId,
          filingDate: documentEntity.createdAt,
        }),
      );
    }
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
