import { MessageResult } from '../../entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getInboxMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the inbox messages
 * @returns {object} the messages in the user inbox
 */
export const getInboxMessagesForUserInteractor = async (
  applicationContext: IApplicationContext,
  { userId }: { userId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getUserInboxMessages({
      applicationContext,
      userId,
    });

  return MessageResult.validateRawCollection(messages, {
    applicationContext,
  });
};
