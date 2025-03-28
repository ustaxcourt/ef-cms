import {
  CHIEF_JUDGE,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getDocumentQCInboxForSection } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection';
import { WorkItemAbomination } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForUser';

export type GetDocumentQCInboxForSectionRequest = {
  judgeUserId?: string;
  section: typeof PETITIONS_SECTION | typeof DOCKET_SECTION;
};

export const getDocumentQCInboxForSectionInteractor = async (
  { judgeUserId, section }: GetDocumentQCInboxForSectionRequest,
  authorizedUser: UnknownAuthUser,
): Promise<WorkItemAbomination[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const judgeId = judgeUserId === CHIEF_JUDGE ? null : judgeUserId;
  const workItems = await getDocumentQCInboxForSection({
    judgeUserId: judgeId,
    section,
  });

  return workItems;
};
