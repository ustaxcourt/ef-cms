import { Message } from '@shared/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { markMessageThreadRepliedTo } from '@web-api/persistence/postgres/messages/markMessageThreadRepliedTo';
import { orderBy } from 'lodash';
import { updateMessage } from '@web-api/persistence/postgres/messages/updateMessage';

export const completeMessageInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    messages,
  }: { messages: { messageBody: string; parentMessageId: string }[] },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let completedMessageIds: string[] = [];

  try {
    for (const message of messages) {
      await markMessageThreadRepliedTo({
        parentMessageId: message.parentMessageId,
      });

      const messageThread = await getMessageThreadByParentId({
        parentMessageId: message.parentMessageId,
      });

      const mostRecentMessage = orderBy(messageThread, 'createdAt', 'desc')[0];

      const updatedMessage = new Message(mostRecentMessage).validate();

      updatedMessage.markAsCompleted({ message: message.messageBody, user });

      const validatedRawMessage = updatedMessage.validate().toRawObject();

      await updateMessage({
        message: validatedRawMessage,
      });

      completedMessageIds.push(validatedRawMessage.messageId);
    }
  } catch (error) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      message: {
        action: 'message_completion_error',
        alertError: {
          message: 'Please try again',
          title: 'Message(s) could not be completed',
        },
      },
      userId: user.userId,
    });
  }
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'message_completion_success',
      completedMessageIds,
    },
    userId: user.userId,
  });
};
