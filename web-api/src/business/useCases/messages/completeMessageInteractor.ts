import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/getMessageThreadByParentId';
import { markMessageThreadRepliedTo } from '@web-api/persistence/postgres/markMessageThreadRepliedTo';
import { orderBy } from 'lodash';
import { updateMessage } from '@web-api/persistence/postgres/updateMessage';

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
  applicationContext: ServerApplicationContext,
  { message, parentMessageId }: { message: string; parentMessageId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  await markMessageThreadRepliedTo({
    applicationContext,
    parentMessageId,
  });

  const messages = await getMessageThreadByParentId({
    applicationContext,
    parentMessageId,
  });

  const mostRecentMessage = orderBy(messages, 'createdAt', 'desc')[0];

  const updatedMessage = new Message(mostRecentMessage, {
    applicationContext,
  }).validate();

  updatedMessage.markAsCompleted({ message, user });

  const validatedRawMessage = updatedMessage.validate().toRawObject();

  await updateMessage({
    message: validatedRawMessage,
  });

  return validatedRawMessage;
};
