import {
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';
import { WorkItem } from '../../entities/WorkItem';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.section the section to get the document qc
 * @returns {object} the work items in the section document inbox
 */
export const getDocumentQCInboxForSectionInteractor: {
  (
    applicationContext: IApplicationContext,
    options: {
      judgeUserName: string;
      section: string;
    },
  ): Promise<WorkItem>;
} = async (applicationContext, { judgeUserName, section }) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  let sectionToShow = section;
  if (section !== PETITIONS_SECTION) {
    sectionToShow = DOCKET_SECTION;
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCInboxForSection({
      applicationContext,
      judgeUserName,
      section: sectionToShow,
    });

  return WorkItem.validateRawCollection(workItems, {
    applicationContext,
  });
};
