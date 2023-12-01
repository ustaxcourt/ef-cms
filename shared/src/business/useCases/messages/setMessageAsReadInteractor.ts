import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  applicationContext: IApplicationContext,
  { docketNumber, messageId }: { docketNumber: string; messageId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext
    .getPersistenceGateway()
    .setMessageAsRead({ applicationContext, docketNumber, messageId });
};
