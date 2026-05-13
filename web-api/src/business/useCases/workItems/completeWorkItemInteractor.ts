import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { RawWorkItem } from '@shared/business/entities/WorkItem';

export const completeWorkItem = async (
  _applicationContext: ServerApplicationContext,
  {
    completedMessage,
    workItemId,
  }: {
    completedMessage: string;
    workItemId: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<RawWorkItem> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for complete workItem');
  }

  const originalWorkItemEntity = await getWorkItemById({
    workItemId,
  });

  if (!originalWorkItemEntity) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const completedWorkItem = originalWorkItemEntity
    .setAsCompleted({
      message: completedMessage,
      user: authorizedUser,
    })
    .validate()
    .toRawObject();

  await upsertWorkItems({
    workItems: [completedWorkItem],
  });

  return completedWorkItem;
};

export const determineEntitiesToLock = async ({
  workItemId,
}: {
  workItemId: string;
}) => {
  const originalWorkItem = await getWorkItemById({
    workItemId,
  });

  if (!originalWorkItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  return {
    identifiers: [`case|${originalWorkItem.docketNumber}`],
  };
};

export const completeWorkItemInteractor = withLocking(
  completeWorkItem,
  determineEntitiesToLock,
);
