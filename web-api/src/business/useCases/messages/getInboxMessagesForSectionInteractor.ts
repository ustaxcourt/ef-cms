import { MessageResult } from '../../../../../shared/src/business/entities/MessageResult';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * getInboxMessagesForSectionInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the inbox messages
 * @returns {object} the messages in the section inbox
 */
export const getInboxMessagesForSectionInteractor = async (
  applicationContext: ServerApplicationContext,
  { section }: { section: string },
) => {
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

  return MessageResult.validateRawCollection(messages, {
    applicationContext,
  });
};
