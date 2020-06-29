const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * gets a case message
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.messageId the id of the message to retrieve
 * @returns {object} the case message
 */
exports.getCaseMessageInteractor = async ({
  applicationContext,
  messageId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseMessage = await applicationContext
    .getPersistenceGateway()
    .getCaseMessageById({
      applicationContext,
      messageId,
    });

  return new CaseMessage(caseMessage, { applicationContext })
    .validate()
    .toRawObject();
};
