const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCaseDeadlineInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseDeadlineId the id of the case deadline to delete
 * @param {string} providers.caseId the id of the case the case deadline is attached to
 * @returns {Promise} the promise of the delete call
 */
exports.deleteCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadlineId,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for deleting case deadline');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({ applicationContext, caseId });

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

  return await applicationContext.getPersistenceGateway().deleteCaseDeadline({
    applicationContext,
    caseDeadlineId,
    caseId,
  });
};
