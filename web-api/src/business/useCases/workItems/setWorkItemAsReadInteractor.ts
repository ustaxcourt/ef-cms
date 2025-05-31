import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getWorkItemById } from '@web-api/persistence/postgres/workitems/getWorkItemById';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';

/**
 * setWorkItemAsReadInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.workItemId the id of the work item to set as read
 * @returns {Promise} the promise of the setWorkItemAsRead call
 */
export const setWorkItemAsReadInteractor = async (
  applicationContext: ServerApplicationContext,
  { workItemId }: { workItemId: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItemRecord = await getWorkItemById({ workItemId });

  if (!workItemRecord) {
    throw new NotFoundError(`WorkItem ${workItemId} was not found.`);
  }

  const { docketNumber } = workItemRecord;
  const { docketEntryId } = workItemRecord.docketEntry;

  const caseRecord = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseRecord, { authorizedUser });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(
      `Docket entry ${docketEntryId} was not found on the case ${docketNumber}`,
    );
  }

  docketEntryEntity.workItem.markAsRead();

  await applicationContext.getPersistenceGateway().updateDocketEntry({
    applicationContext,
    docketEntryId,
    docketNumber,
    document: docketEntryEntity.validate().toRawObject(),
  });

  return upsertWorkItems({
    workItems: [docketEntryEntity.workItem.validate().toRawObject()],
  });
};
