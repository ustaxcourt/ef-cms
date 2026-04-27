import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getWorkItemsByIds } from '@web-api/persistence/postgres/workitems/getWorkItemsByIds';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';

export const setWorkItemAsReadInteractor = async (
  { workItemId }: { workItemId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const [workItem] = await getWorkItemsByIds({ workItemIds: [workItemId] });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  workItem.markAsRead();

  return upsertWorkItems({
    workItems: [workItem.validate().toRawObject()],
  });
};
