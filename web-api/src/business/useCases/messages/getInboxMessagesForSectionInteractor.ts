import { MessageResult } from '../../../../../shared/src/business/entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

export const getInboxMessagesForSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getSectionInboxMessages({
      applicationContext,
      section,
    });

  return MessageResult.validateRawCollection(messages, {
    applicationContext,
  });
};
