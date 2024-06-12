import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UserRecord } from '../../../../../web-api/src/persistence/dynamo/dynamoTypes';
import { orderBy } from 'lodash';

export const completeMessageInteractor = async (
  applicationContext: IApplicationContext,
  {
    messages,
  }: { messages: { messageBody: string; parentMessageId: string }[] },
): Promise<{ user: UserRecord }> => {
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
  return { user };
};
