import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const removePetitionerAndUpdateCaption = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contactId,
    docketNumber,
  }: { caseCaption: string; contactId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  const petitionerContactId = contactId;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER)) {
    throw new UnauthorizedError(
      'Unauthorized for removing petitioner from case',
    );
  }

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} not found`);
  }

  let caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (caseToUpdate.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${caseToUpdate.docketNumber} has not been served`,
    );
  }

  if (caseEntity.petitioners.length <= 1) {
    throw new Error(
      `Cannot remove petitioner ${petitionerContactId} from case with docketNumber ${caseToUpdate.docketNumber}`,
    );
  }

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .removeCounselFromRemovedPetitioner({
      authorizedUser,
      caseEntity,
      petitionerContactId,
    });

  caseEntity.removePetitioner(petitionerContactId);

  caseEntity.caseCaption = caseCaption;

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};

export const removePetitionerAndUpdateCaptionInteractor = withLocking(
  removePetitionerAndUpdateCaption,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
