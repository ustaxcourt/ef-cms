const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
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

  return await applicationContext.getPersistenceGateway().deleteCaseDeadline({
    applicationContext,
    caseDeadlineId,
    caseId,
  });
};
