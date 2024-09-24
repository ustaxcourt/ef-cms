import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../../../../../shared/src/business/entities/WorkItem';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';

/**
 * getWorkItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.workItemId the id of the work item to get
 * @returns {object} the work item data
 */
export const getWorkItemInteractor = async (
  applicationContext: ServerApplicationContext,
  { workItemId }: { workItemId: string },
  authorizedUser: UnknownAuthUser,
) => {
  const workItem = await getWorkItemById({
    workItemId,
  });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  if (
    !isAuthorized(
      authorizedUser,
      ROLE_PERMISSIONS.WORKITEM,
      workItem.assigneeId,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  return new WorkItem(workItem).validate().toRawObject();
};
