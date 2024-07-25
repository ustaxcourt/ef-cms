import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { setMessageAsRead } from '@web-api/persistence/postgres/messages/setMessageAsRead';

/**
 * setMessageAsReadInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number for the case the message is associated with
 * @param {string} providers.messageId the id of the message to set as read
 * @returns {Promise} the promise of the setMessageAsRead call
 */
export const setMessageAsReadInteractor = async (
  applicationContext: ServerApplicationContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { docketNumber, messageId }: { docketNumber: string; messageId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await setMessageAsRead({ messageId });
};
