const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { CaseMessage } = require('../../entities/CaseMessage');
const { orderBy } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * completes a case message thread
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {object} the case message
 */
exports.completeCaseMessageInteractor = async ({
  applicationContext,
  message,
  parentMessageId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  await applicationContext
    .getPersistenceGateway()
    .markCaseMessageThreadRepliedTo({
      applicationContext,
      parentMessageId,
    });

  const messages = await applicationContext
    .getPersistenceGateway()
    .getCaseMessageThreadByParentId({
      applicationContext,
      parentMessageId,
    });

  const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

  const updatedCaseMessage = new CaseMessage(mostRecentMessage, {
    applicationContext,
  }).validate();

  updatedCaseMessage.markAsCompleted({ message, user });

  const updatedMessage = await applicationContext
    .getPersistenceGateway()
    .updateCaseMessage({
      applicationContext,
      caseMessage: updatedCaseMessage.validate().toRawObject(),
    });

  return new CaseMessage(updatedMessage, { applicationContext })
    .validate()
    .toRawObject();
};
