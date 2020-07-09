const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getCompletedCaseMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the inbox messages
 * @returns {object} the messages in the user inbox
 */
exports.getCompletedCaseMessagesForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getCompletedUserInboxMessages({
      applicationContext,
      userId,
    });

  return CaseMessage.validateRawCollection(messages, {
    applicationContext,
  });
};
