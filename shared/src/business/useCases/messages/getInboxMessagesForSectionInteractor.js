const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the inbox messages
 * @returns {object} the messages in the section inbox
 */
exports.getInboxMessagesForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getSectionInboxMessages({
      applicationContext,
      section,
    });

  return Message.validateRawCollection(messages, {
    applicationContext,
  });
};
