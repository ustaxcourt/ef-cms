const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { UNSERVABLE_EVENT_CODES } = require('../../entities/EntityConstants');

/**
 * fetchPendingItemsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judge the optional judge filter
 * @param {number} providers.page the optional page number
 * @returns {Array} the pending items found
 */
exports.fetchPendingItemsInteractor = async (
  applicationContext,
  { judge, page },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!judge) {
    throw new Error('judge is required');
  }

  //depends on fetchPendingItems returning a list already sorted by receivedAt
  return await applicationContext.getPersistenceGateway().fetchPendingItems({
    applicationContext,
    judge,
    page,
    unservableEventCodes: UNSERVABLE_EVENT_CODES,
  });
};
