import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '@shared/business/entities/WorkItem';

export type WorkItemBox = 'inbox' | 'inProgress' | 'outbox';

export const getDocumentQCForUserInteractor = async (
  applicationContext: IApplicationContext,
  { box, userId }: { box: WorkItemBox; userId: string | null },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    userId === null ||
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  let workItems: RawWorkItem[] = [];

  if (box === 'inbox' || box === 'inProgress') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCForUser({
        applicationContext,
        box,
        userId,
      });
  } else if (box === 'outbox') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCServedForUser({
        applicationContext,
        userId,
      });
  } else {
    throw new InvalidRequest('Did not receive a valid box to query');
  }

  return WorkItem.validateRawCollection(workItems, {
    applicationContext,
  });
};
