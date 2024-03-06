import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../entities/EntityConstants';
import { InvalidRequest, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '../../entities/WorkItem';

export const getDocumentQCForSectionInteractor = async (
  applicationContext: IApplicationContext,
  {
    box,
    judgeUserName,
    section,
  }: {
    box: 'inbox' | 'inProgress' | 'outbox';
    judgeUserName?: string;
    section: string;
  },
): Promise<RawWorkItem[]> => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const sectionToShow =
    section === PETITIONS_SECTION ? PETITIONS_SECTION : DOCKET_SECTION;

  let workItems: RawWorkItem[] = [];

  if (box === 'inbox' || box === 'inProgress') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCForSection({
        applicationContext,
        box,
        judgeUserName,
        section: sectionToShow,
      });
  } else if (box === 'outbox') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCServedForSection({
        applicationContext,
        section: sectionToShow,
      });
  } else {
    throw new InvalidRequest('Did not receive a valid box to query');
  }

  return WorkItem.validateRawCollection(workItems, {
    applicationContext,
  });
};
