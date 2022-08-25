import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Message } from '../../entities/Message';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * gets a message thread by parent id
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.parentMessageId the id of the parent message for the thread
 * @returns {object} the message
 */
export const getMessageThreadInteractor: IGetMessageThreadInteractor = async (
  applicationContext,
  { parentMessageId },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getMessageThreadByParentId({
      applicationContext,
      parentMessageId,
    });

  return Message.validateRawCollection(messages, {
    applicationContext,
  });
};
