const { Case } = require('../../entities/cases/Case');
const { isPrivateDocument } = require('../../entities/cases/PublicCase');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getPublicDownloadPolicyUrlInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case containing the document
 * @param {string} providers.documentId the document id
 * @returns {string} the document download url
 */
exports.getPublicDownloadPolicyUrlInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  const caseToCheck = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToCheck, { applicationContext });

  if (caseEntity.isSealed) {
    throw new UnauthorizedError(
      'Unauthorized to access documents in a sealed case',
    );
  }

  const documentEntity = caseEntity.getDocumentById({ documentId });

  const isPrivate = isPrivateDocument(documentEntity, caseEntity.docketRecord);

  if (isPrivate) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext
    .getPersistenceGateway()
    .getPublicDownloadPolicyUrl({
      applicationContext,
      documentId,
    });
};
