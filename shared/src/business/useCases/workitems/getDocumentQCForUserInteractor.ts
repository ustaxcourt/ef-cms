import { ROLES } from '@shared/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { RawWorkItem, WorkItem } from '../../entities/WorkItem';
import { UnauthorizedError } from '@web-api/errors/errors';

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
  {
    box,
    userId,
  }: { box: 'inbox' | 'inProgress' | 'outbox'; userId: string | null },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (
    userId === null ||
    !isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });
  let workItems: RawWorkItem[] = [];

  if (box === 'inbox' || box === 'inProgress') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCForUser({
        applicationContext,
        box,
        userId,
      });
    workItems = workItems.filter(
      workItem =>
        workItem.assigneeId === user.userId &&
        workItem.section === user.section,
    );
  } else if (box === 'outbox') {
    workItems = await applicationContext
      .getPersistenceGateway()
      .getDocumentQCServedForUser({
        applicationContext,
        userId,
      });

    workItems = workItems.filter(workItem =>
      user.role === ROLES.petitionsClerk ? !!workItem.section : true,
    );
  }

  return WorkItem.validateRawCollection(workItems, {
    applicationContext,
  });
};
