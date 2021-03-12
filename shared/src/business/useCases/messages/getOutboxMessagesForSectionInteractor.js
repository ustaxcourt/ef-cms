const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getOutboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the outbox messages
 * @returns {object} the messages in the section outbox
 */
exports.getOutboxMessagesForSectionInteractor = async (
  applicationContext,
  { section },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getSectionOutboxMessages({
      applicationContext,
      section,
    });

  return Message.validateRawCollection(messages, {
    applicationContext,
  });
};
