import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Message } from '../../entities/Message';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getOutboxMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the outbox messages
 * @returns {object} the messages in the user outbox
 */
export const getOutboxMessagesForUserInteractor: IGetOutboxMessagesForUserInteractor =
  async (applicationContext, { userId }) => {
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
