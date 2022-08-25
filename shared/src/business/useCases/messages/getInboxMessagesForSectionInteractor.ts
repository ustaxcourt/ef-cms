import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Message } from '../../entities/Message';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the inbox messages
 * @returns {object} the messages in the section inbox
 */
export const getInboxMessagesForSectionInteractor: IGetInboxMessagesForSectionInteractor =
  async (applicationContext, { section }) => {
    const authorizedUser = applicationContext.getCurrentUser();

    if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
      throw new UnauthorizedError('Unauthorized');
    }

    const messages = await applicationContext
      .getPersistenceGateway()
      .getSectionInboxMessages({
        applicationContext,
        section,
      });

    return Message.validateRawCollection(messages, {
      applicationContext,
    });
  };
