import { MessageResult } from '../../../../../shared/src/business/entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getOutboxMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the outbox messages
 * @returns {object} the messages in the user outbox
 */
export const getOutboxMessagesForUserInteractor = async (
  applicationContext: ServerApplicationContext,
  { userId }: { userId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getUserOutboxMessages({
      applicationContext,
      userId,
    });

  return MessageResult.validateRawCollection(messages, {
    applicationContext,
  });
};
