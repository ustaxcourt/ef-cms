import { Message } from '../../entities/Message';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getOutboxMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the outbox messages
 * @returns {object} the messages in the user outbox
 */
export const getOutboxMessagesForUserInteractor = async (
  applicationContext: IApplicationContext,
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

  return Message.validateRawCollection(messages, {
    applicationContext,
  });
};
