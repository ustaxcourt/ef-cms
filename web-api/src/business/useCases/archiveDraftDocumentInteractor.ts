import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deleteWorkItem } from '@web-api/persistence/postgres/workitems/deleteWorkItem';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  hashLockId,
  mutexLockWrapper,
} from '@web-api/persistence/postgres/utils/mutex';

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

  caseEntity.archiveDocketEntry(docketEntryToArchive);

  const { workItem } = docketEntryToArchive;

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

export const archiveDraftDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryId,
    docketNumber,
  }: { docketEntryId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  const lockId = hashLockId(`case|${docketNumber}`);

  return mutexLockWrapper({
    lockId,
    callback: () =>
      archiveDraftDocument(
        applicationContext,
        { docketEntryId, docketNumber },
        authorizedUser,
      ),
  });
};

// export const archiveDraftDocumentInteractor = withLocking(
//   archiveDraftDocument,
//   (_applicationContext, { docketNumber }) => ({
//     identifiers: [`case|${docketNumber}`],
//   }),
// );
