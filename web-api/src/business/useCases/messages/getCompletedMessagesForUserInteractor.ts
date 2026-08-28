import { MessageResult } from '../../../../../shared/src/business/entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCompletedUserInboxMessages } from '@web-api/persistence/postgres/messages/getCompletedUserInboxMessages';
import { isAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getCompletedMessagesForUserInteractor = async (
  _applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<ExcludeMethods<MessageResult>[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const isSelf = isAuthUser(authorizedUser) && authorizedUser.userId === userId;
  const canViewOtherUsersMessages = isAuthorized(
    authorizedUser,
    ROLE_PERMISSIONS.DOCKET_CLERK_REPORT,
  );

  if (!isSelf && !canViewOtherUsersMessages) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await getCompletedUserInboxMessages({
    userId,
  });

  return MessageResult.validateRawCollection(messages);
};
