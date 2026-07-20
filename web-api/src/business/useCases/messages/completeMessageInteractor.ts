import { Message } from '@shared/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';
import { markMessageThreadRepliedTo } from '@web-api/persistence/postgres/messages/markMessageThreadRepliedTo';
import { orderBy } from 'lodash';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { upsertMessages } from '@web-api/persistence/postgres/messages/upsertMessages';
import {
  onTransactionCommit,
  withTransaction,
} from '@web-api/persistence/postgres/utils/transactions';

export const completeMessageInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    completedByUserId,
    messages,
  }: {
    completedByUserId?: string;
    messages: { messageBody: string; parentMessageId: string }[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SEND_RECEIVE_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // By default a user completes their own messages. Completing on behalf of
  // another clerk (the docket clerk report) attributes the completion to that
  // clerk and is gated behind the report permission.
  let completingUserId = authorizedUser.userId;
  if (completedByUserId && completedByUserId !== authorizedUser.userId) {
    if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_CLERK_REPORT)) {
      throw new UnauthorizedError(
        'Unauthorized to complete messages on behalf of another user',
      );
    }
    completingUserId = completedByUserId;
  }

  const user = await getUserById({ userId: completingUserId });

  if (!user) {
    throw new NotFoundError(`User not found with user id ${completingUserId}`);
  }

  const completedMessageIds: string[] = [];

  try {
    await withTransaction(async () => {
      for (const message of messages) {
        await markMessageThreadRepliedTo({
          parentMessageId: message.parentMessageId,
        });

        const messageThread = await getMessageThreadByParentId({
          parentMessageId: message.parentMessageId,
        });

        const mostRecentMessage = orderBy(
          messageThread,
          'createdAt',
          'desc',
        )[0];

        const updatedMessage = new Message(mostRecentMessage).validate();

        updatedMessage.markAsCompleted({ message: message.messageBody, user });

        const validatedRawMessage = updatedMessage.validate().toRawObject();

        await upsertMessages([validatedRawMessage]);

        completedMessageIds.push(validatedRawMessage.messageId);
      }

      onTransactionCommit(async () => {
        await applicationContext
          .getNotificationGateway()
          .sendNotificationToUser({
            applicationContext,
            message: {
              action: 'message_completion_success',
              completedMessageIds,
            },
            userId: authorizedUser.userId,
          });
      });
    });
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
      userId: authorizedUser.userId,
    });
  }
};
