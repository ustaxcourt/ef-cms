const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Array<string>} the filing type options based on user role
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
