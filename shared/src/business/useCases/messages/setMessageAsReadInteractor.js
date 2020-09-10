const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setMessageAsReadInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to set as read
 * @returns {Promise} the promise of the setMessageAsRead call
 */
exports.setMessageAsReadInteractor = async ({
  applicationContext,
  messageId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext
    .getPersistenceGateway()
    .setMessageAsRead({ applicationContext, messageId, userId: user.userId });
};
