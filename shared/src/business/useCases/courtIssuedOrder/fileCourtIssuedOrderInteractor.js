const {
  CREATE_COURT_ISSUED_ORDER,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param documentMetadata
 * @param primaryDocumentFileId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.fileCourtIssuedOrderInteractor = async ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
}) => {
  const user = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(user, CREATE_COURT_ISSUED_ORDER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate);

  if (primaryDocumentFileId && documentMetadata) {
    const documentEntity = new Document({
      ...documentMetadata,
      relationship: 'primaryDocument',
      documentId: primaryDocumentFileId,
      documentType: documentMetadata.documentType,
      userId: user.userId,
    });
    documentEntity.processingStatus = 'complete';

    caseEntity.addDocumentWithoutDocketRecord(documentEntity);

    caseEntity.addDocketRecord(
      new DocketRecord({
        description: documentMetadata.documentTitle,
        documentId: documentEntity.documentId,
        filingDate: documentEntity.receivedAt,
      }),
    );
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
