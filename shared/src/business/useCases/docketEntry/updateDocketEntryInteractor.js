const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { pick } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @param {string} providers.secondaryDocumentFileId the id of the secondary document file (optional)
 * @param {string} providers.secondarySupportingDocumentFileId the id of the secondary supporting document file (optional)
 * @param {string} providers.supportingDocumentFileId the id of the supporting document file (optional)
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryInteractor = async ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
  secondaryDocumentFileId,
  secondarySupportingDocumentFileId,
  supportingDocumentFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId } = documentMetadata;
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate);

  const {
    secondaryDocument,
    secondarySupportingDocumentMetadata,
    supportingDocumentMetadata,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyRespondent',
    'practitioner',
  ]);

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
  }
  if (secondarySupportingDocumentMetadata) {
    secondarySupportingDocumentMetadata.lodged = true;
  }

  [
    [primaryDocumentFileId, primaryDocumentMetadata, 'primaryDocument'],
    [
      supportingDocumentFileId,
      supportingDocumentMetadata,
      'primarySupportingDocument',
    ],
    [secondaryDocumentFileId, secondaryDocument, 'secondaryDocument'],
    [
      secondarySupportingDocumentFileId,
      secondarySupportingDocumentMetadata,
      'secondarySupportingDocument',
    ],
  ].forEach(([documentId, metadata, relationship]) => {
    if (documentId && metadata) {
      const documentEntity = new Document({
        ...baseMetadata,
        ...metadata,
        relationship,
        documentId,
        documentType: metadata.documentType,
        userId: user.userId,
      });
      documentEntity.generateFiledBy(caseToUpdate);

      const docketRecordEntry = new DocketRecord({
        description: metadata.documentTitle,
        documentId: documentEntity.documentId,
        editState: JSON.stringify(documentMetadata),
        filingDate: documentEntity.receivedAt,
      });

      caseEntity.updateDocketRecordEditState(docketRecordEntry);
    }
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
