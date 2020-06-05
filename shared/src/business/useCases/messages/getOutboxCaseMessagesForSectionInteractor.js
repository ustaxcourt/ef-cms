const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getOutboxCaseMessagesForSectionInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.section the section to get the outbox messages
 * @returns {object} the messages in the section outbox
 */
exports.getOutboxCaseMessagesForSectionInteractor = async ({
  applicationContext,
  section,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getSectionOutboxMessages({
      applicationContext,
      section,
    });

  return CaseMessage.validateRawCollection(messages, {
    applicationContext,
  });
};
