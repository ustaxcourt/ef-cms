const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * deleteCaseDeadlineInteractor
 *
 * @param applicationContext
 * @param deleteCaseDeadline
 * @returns {*}
 */
exports.deleteCaseDeadlineInteractor = async ({
  applicationContext,
  caseDeadlineId,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized for deleting case deadline');
  }

  return await applicationContext.getPersistenceGateway().deleteCaseDeadline({
    applicationContext,
    caseDeadlineId,
    caseId,
  });
};
