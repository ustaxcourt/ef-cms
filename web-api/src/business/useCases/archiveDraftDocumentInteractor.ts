import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteWorkItem } from '@web-api/persistence/postgres/workitems/deleteWorkItem';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export const archiveDraftDocument = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ARCHIVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const docketEntryToArchive = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryToArchive) {
    throw new NotFoundError(
      `Could not find docket entry ${docketEntryId} on case ${docketNumber}`,
    );
  }

  caseEntity.archiveDocketEntry(
    new DocketEntry(docketEntryToArchive, { authorizedUser }),
  );

  const workItem = await getWorkItemByDocketNumberAndDocketEntryId({
    docketNumber,
    docketEntryId,
  });

  if (workItem) {
    await deleteWorkItem({
      workItem,
    });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const archiveDraftDocumentInteractor = withLocking(
  archiveDraftDocument,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
