const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * removeCasePendingItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.documentId the id of the document no longer pending
 * @returns {object} the updated case data
 */
exports.removeCasePendingItemInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

  caseToUpdate.documents.forEach(document => {
    if (document.documentId === documentId) {
      document.pending = false;
    }
  });

  const updatedCase = new Case(caseToUpdate, { applicationContext });

  const caseDeadlines = await applicationContext
    .getPersistenceGateway()
    .getCaseDeadlinesByCaseId({
      applicationContext,
      caseId: caseToUpdate.caseId,
    });

  updatedCase.updateAutomaticBlocked({ caseDeadlines });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: updatedCase.validate().toRawObject(),
  });

  return updatedCase;
};
