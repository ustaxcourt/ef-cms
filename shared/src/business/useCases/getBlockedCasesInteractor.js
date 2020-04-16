const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getBlockedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.trialLocation the preferredTrialLocation to filter the blocked cases by
 * @returns {object} the case data
 */
exports.getBlockedCasesInteractor = async ({
  applicationContext,
  trialLocation,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.BLOCK_CASE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const foundCases = await applicationContext
    .getPersistenceGateway()
    .getBlockedCases({
      applicationContext,
      trialLocation,
    });

  return foundCases;
};
