import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateCaseCorrespondence } from '@web-api/persistence/postgres/correspondence/updateCaseCorrespondence';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const archiveCorrespondenceDocument = async (
  applicationContext: ServerApplicationContext,
  {
    correspondenceId,
    docketNumber,
  }: { correspondenceId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  await applicationContext.getPersistenceGateway().deleteDocumentFile({
    applicationContext,
    key: correspondenceId,
  });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });
  const correspondenceToArchiveEntity = caseEntity.correspondence.find(
    c => c.correspondenceId === correspondenceId,
  );

  caseEntity.archiveCorrespondence(correspondenceToArchiveEntity);

  await updateCaseCorrespondence({
    correspondence: correspondenceToArchiveEntity.validate().toRawObject(),
    docketNumber,
  });

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

export const archiveCorrespondenceDocumentInteractor = withLocking(
  archiveCorrespondenceDocument,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
