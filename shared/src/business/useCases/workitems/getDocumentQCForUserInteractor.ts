import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { WorkItem } from '../../entities/WorkItem';

/**
 * getDocumentQCInboxForUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.userId the user to get the document qc
 * @returns {object} the work items in the user document inbox
 */
export const getDocumentQCForUserInteractor = async (
  applicationContext: IApplicationContext,
  { box, userId }: { box: 'inbox' | 'inProgress' | 'outbox'; userId: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  // const user = await applicationContext
  //   .getPersistenceGateway()
  //   .getUserById({ applicationContext, userId: authorizedUser.userId });

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCForUser({
      applicationContext,
      box,
      userId,
    });

  // const filteredWorkItems = workItems.filter(
  //   workItem =>
  //     workItem.assigneeId === user.userId && workItem.section === user.section,
  // );

  return WorkItem.validateRawCollection(workItems, {
    applicationContext,
  });
};
