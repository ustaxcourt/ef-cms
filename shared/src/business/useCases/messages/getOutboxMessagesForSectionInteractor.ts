import { MessageResult } from '../../entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getOutboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the outbox messages
 * @returns {object} the messages in the section outbox
 */
export const getOutboxMessagesForSectionInteractor = async (
  applicationContext: IApplicationContext,
  { section }: { section: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.VIEW_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const messages = await applicationContext
    .getPersistenceGateway()
    .getSectionOutboxMessages({
      applicationContext,
      section,
    });

  return MessageResult.validateRawCollection(messages, {
    applicationContext,
  });
};
