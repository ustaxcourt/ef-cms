import { ROLES } from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { WorkItem } from '../../entities/WorkItem';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc served box
 * @returns {object} the work items in the user document served inbox
 */
export const getDocumentQCServedForUserInteractor = async (
  applicationContext: IApplicationContext,
  { userId }: { userId: string },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCServedForUser({
      applicationContext,
      userId,
    });

  const filteredWorkItems = workItems.filter(workItem =>
    user.role === ROLES.petitionsClerk ? !!workItem.section : true,
  );

  return WorkItem.validateRawCollection(filteredWorkItems, {
    applicationContext,
  });
};
