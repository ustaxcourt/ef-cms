import {
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

export const getDocumentQCInboxForSectionInteractor = async (
  {
    judgeUserName,
    section,
  }: {
    judgeUserName?: string;
    section: string;
  },
  authorizedUser: UnknownAuthUser,
): Promise<WorkItemAbomination[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  let sectionToShow = section;
  if (section !== PETITIONS_SECTION) {
    sectionToShow = DOCKET_SECTION;
  }

  const workItems = await getDocumentQCInboxForSection({
    judgeUserName,
    section: sectionToShow,
  });

  return workItems;
};
