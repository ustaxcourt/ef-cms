const {
  CASE_DEADLINE,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getAllCaseDeadlinesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the getCaseDeadlines call
 */
exports.getAllCaseDeadlinesInteractor = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, CASE_DEADLINE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return await applicationContext.getPersistenceGateway().getAllCaseDeadlines({
    applicationContext,
  });
};
