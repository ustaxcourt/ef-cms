import { MessageResult } from '../../../../../shared/src/business/entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getUserInboxMessages } from '@web-api/persistence/postgres/messages/getUserInboxMessages';

export const getInboxMessagesForUserInteractor = async (
  applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await getUserInboxMessages({
    applicationContext,
    userId,
  });

  return MessageResult.validateRawCollection(messages);
};
