const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case containing the document
 * @param {string} providers.documentId the document id
 * @returns {string} the document download url
 */
exports.getPublicDownloadPolicyUrlInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const caseToCheck = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToCheck, { applicationContext });

  const documentEntity = caseEntity.getDocumentById({ documentId });

  const isPublic = documentEntity.isPublicAccessible();

  if (!isPublic) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getPersistenceGateway()
    .getPublicDownloadPolicyUrl({
      applicationContext,
      documentId,
    });
};
