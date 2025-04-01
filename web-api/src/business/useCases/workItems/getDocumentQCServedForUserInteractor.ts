import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  calculateDate,
  createISODateAtStartOfDayEST,
} from '@shared/business/utilities/DateHandler';
import { getDocumentQCServedForUser } from '@web-api/persistence/postgres/workitems/getDocumentQCServedForUser';
import { WorkItemWithCaseInfo } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export const getDocumentQCServedForUserInteractor = async (
  { userId }: { userId: string },
  authorizedUser: UnknownAuthUser,
): Promise<WorkItemWithCaseInfo[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const startOfDay = createISODateAtStartOfDayEST();
  const afterDate = calculateDate({
    dateString: startOfDay,
    howMuch: -7,
    units: 'days',
  });

  const workItems = await getDocumentQCServedForUser({
    afterDate,
    userId,
  });

  const filteredWorkItems = workItems.filter(workItem =>
    authorizedUser.role === ROLES.petitionsClerk ? !!workItem.section : true,
  );

  return filteredWorkItems;
};
