import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Message } from '../../entities/Message';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getCompletedMessagesForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the inbox messages
 * @returns {object} the messages in the user inbox
 */
export const getCompletedMessagesForUserInteractor: IGetCompletedMessagesForUserInteractor =
  async (applicationContext, { userId }) => {
    const authorizedUser = applicationContext.getCurrentUser();

    if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
      throw new UnauthorizedError('Unauthorized');
    }

    const messages = await applicationContext
      .getPersistenceGateway()
      .getCompletedUserInboxMessages({
        applicationContext,
        userId,
      });

    const validatedMessages = (
      Message.validateRawCollection as IValidateRawCollection<TMessageData>
    )(messages, {
      applicationContext,
    });

    return validatedMessages;
  };
