import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getDocumentQCInboxForSection } from '@web-api/persistence/postgres/workitems/getDocumentQCInboxForSection';
import { getQCInboxParameters } from '@web-api/business/utilities/getQCInboxParameters';
import { RawWorkItemWithCaseAndDocketEntryInfo } from '@web-api/persistence/postgres/workitems/schema';

export type GetDocumentQCInboxForSectionRequest = {
  judgeId?: string;
  section: string;
  selectedSection?: string;
};

export const getDocumentQCInboxForSectionInteractor = async (
  { judgeId, section, selectedSection }: GetDocumentQCInboxForSectionRequest,
  authorizedUser: UnknownAuthUser,
): Promise<RawWorkItemWithCaseAndDocketEntryInfo[]> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const workItems = await getDocumentQCInboxForSection(
    getQCInboxParameters({
      judgeId,
      user: authorizedUser,
      section,
      selectedSection,
    }),
  );

  return workItems;
};
