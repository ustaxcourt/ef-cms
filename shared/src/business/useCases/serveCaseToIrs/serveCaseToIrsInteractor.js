const {
  isAuthorized,
  SERVE_CASE_TO_IRS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @returns {*}
 */
exports.serveCaseToIrsInteractor = async ({ applicationContext, caseId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, SERVE_CASE_TO_IRS)) {
    throw new UnauthorizedError('Unauthorized', caseId);
  }
};
