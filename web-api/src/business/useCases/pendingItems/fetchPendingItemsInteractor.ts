import { PendingItem } from '@web-api/persistence/elasticsearch/fetchPendingItems';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UNSERVABLE_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';

export const fetchPendingItemsInteractor = async (
  applicationContext: IApplicationContext,
  { judge, page }: { judge: string; page: number },
): Promise<{
  foundDocuments: PendingItem[];
  total: number;
}> => {
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
