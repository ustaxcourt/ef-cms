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
  { message, parentMessageId }: { message: string; parentMessageId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
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

  await applicationContext.getPersistenceGateway().upsertMessage({
    applicationContext,
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};
