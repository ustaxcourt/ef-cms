const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Message } = require('../../entities/Message');
const { orderBy } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * completes a message thread
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {object} the message
 */
exports.completeMessageInteractor = async ({
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

  await applicationContext.getPersistenceGateway().markMessageThreadRepliedTo({
    applicationContext,
    parentMessageId,
  });

  const messages = await applicationContext
    .getPersistenceGateway()
    .getMessageThreadByParentId({
      applicationContext,
      parentMessageId,
    });

  const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

  const updatedMessage = new Message(mostRecentMessage, {
    applicationContext,
  }).validate();

  updatedMessage.markAsCompleted({ message, user });

  const validatedRawMessage = updatedMessage.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateMessage({
    applicationContext,
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};
