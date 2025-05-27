import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { Correspondence } from '@shared/business/entities/Correspondence';

export const archiveCorrespondenceDocument = async (
  applicationContext: ServerApplicationContext,
  {
    correspondenceId,
    docketNumber,
  }: { correspondenceId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFile({
    applicationContext,
    key: correspondenceId,
  });

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });
  const correspondenceToArchiveEntity = caseEntity.correspondence.find(
    c => c.correspondenceId === correspondenceId,
  );

  if (!correspondenceToArchiveEntity) {
    throw new NotFoundError(
      `Unable to find correspondence to archive for correspondenceId: ${correspondenceId}`,
    );
  }

  caseEntity.archiveCorrespondence(correspondenceToArchiveEntity);

  await upsertCaseCorrespondences([
    (correspondenceToArchiveEntity as Correspondence).validate().toRawObject(),
  ]);

  return applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

// export const archiveCorrespondenceDocumentInteractor = async (
//   applicationContext: ServerApplicationContext,
//   {
//     correspondenceId,
//     docketNumber,
//   }: { correspondenceId: string; docketNumber: string },
//   authorizedUser: UnknownAuthUser,
// ) => {
//   const lockId = hashLockId(`case|${docketNumber}`);

//   return mutexLockWrapper({
//     lockId,
//     callback: () =>
//       archiveCorrespondenceDocument(
//         applicationContext,
//         { correspondenceId, docketNumber },
//         authorizedUser,
//       ),
//   });
// };

export const archiveCorrespondenceDocumentInteractor = withLocking(
  archiveCorrespondenceDocument,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
