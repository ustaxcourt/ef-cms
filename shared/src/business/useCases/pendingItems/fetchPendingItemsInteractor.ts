import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UNSERVABLE_EVENT_CODES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
/**
 * fetchPendingItemsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.judge the optional judge filter
 * @param {number} providers.page the optional page number
 * @returns {Array} the pending items found
 */
export const fetchPendingItemsInteractor = async (
  applicationContext: IApplicationContext,
  { judge, page }: { judge: string; page: number },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (!judge) {
    throw new Error('judge is required');
  }

  //depends on fetchPendingItems returning a list already sorted by receivedAt
  return await applicationContext.getPersistenceGateway().fetchPendingItems({
    applicationContext,
    judge,
    page,
    unservableEventCodes: UNSERVABLE_EVENT_CODES,
  });
};
