import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { WorkItem } from '../../entities/WorkItem';

/**
 * getWorkItemInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.workItemId the id of the work item to get
 * @returns {object} the work item data
 */
export const getWorkItemInteractor = async (
  applicationContext: IApplicationContext,
  { workItemId }: { workItemId: string },
) => {
  const workItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  if (!workItem) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM, workItem.assigneeId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return new WorkItem(workItem, { applicationContext })
    .validate()
    .toRawObject();
};
