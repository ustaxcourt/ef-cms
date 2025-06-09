import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  getDocumentQCInboxForUser,
  WorkItemWithCaseInfo,
} from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const getDocumentQCInboxForUserInteractor = async (
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<WorkItemWithCaseInfo[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await getDocumentQCInboxForUser({
    userId,
  });

  return workItems;
};
