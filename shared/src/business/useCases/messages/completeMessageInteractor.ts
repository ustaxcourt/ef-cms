import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { orderBy } from 'lodash';

/**
 * completes a message thread
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.message the message text
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {object} the message
 */
export const completeMessageInteractor = async (
  applicationContext: IApplicationContext,
  {
    messages,
  }: { messages: { messageBody: string; parentMessageId: string }[] },
): Promise<void> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  for (const message of messages) {
    await applicationContext
      .getPersistenceGateway()
      .markMessageThreadRepliedTo({
        applicationContext,
        parentMessageId: message.parentMessageId,
      });

    const messageThread = await applicationContext
      .getPersistenceGateway()
      .getMessageThreadByParentId({
        applicationContext,
        parentMessageId: message.parentMessageId,
      });

    const mostRecentMessage = orderBy(messageThread, 'createdAt', 'desc')[0];

    const updatedMessage = new Message(mostRecentMessage, {
      applicationContext,
    }).validate();

    updatedMessage.markAsCompleted({ message: message.messageBody, user });

    const validatedRawMessage = updatedMessage.validate().toRawObject();

    await applicationContext.getPersistenceGateway().updateMessage({
      applicationContext,
      message: validatedRawMessage,
    });
  }
};
