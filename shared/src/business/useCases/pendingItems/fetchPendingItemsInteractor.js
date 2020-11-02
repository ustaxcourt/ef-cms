const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * fetchPendingItemsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {number} providers.page the optional page number
 * @returns {Array} the pending items found
 */
exports.fetchPendingItemsInteractor = async ({
  applicationContext,
  judge,
  page,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!judge) {
    throw new Error('judge is required');
  }

  return await applicationContext
    .getUseCaseHelpers()
    .fetchPendingItems({ applicationContext, judge, page });
};
