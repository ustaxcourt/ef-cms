import { Message } from '../../../../../shared/src/business/entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getMessageThreadByParentId } from '@web-api/persistence/postgres/messages/getMessageThreadByParentId';

export const getMessageThreadInteractor = async (
  applicationContext: ServerApplicationContext,
  { parentMessageId }: { parentMessageId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await getMessageThreadByParentId({
    parentMessageId,
  });

  return Message.validateRawCollection(messages);
};
