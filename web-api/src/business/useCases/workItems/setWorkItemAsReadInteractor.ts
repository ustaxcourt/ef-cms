import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { RawWorkItem } from '@shared/business/entities/WorkItem';

export const setWorkItemAsReadInteractor = async (
  { workItemId }: { workItemId: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawWorkItem[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItem = await getWorkItemById({ workItemId });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  workItem.markAsRead();

  return upsertWorkItems({
    workItems: [workItem.validate().toRawObject()],
  });
};
