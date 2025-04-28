import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { deletePetitionerOnCase } from '@web-api/persistence/postgres/cases/parties/deletePetitionerOnCase';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  hashLockId,
  mutexLockWrapper,
} from '@web-api/persistence/postgres/utils/mutex';

/**
 * used to remove a petitioner from a case
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseCaption the updated caseCaption
 * @param {object} providers.contactId the contactId of the person to remove from the case
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the case data
 */
export const removePetitionerAndUpdateCaption = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contactId,
    docketNumber,
  }: { caseCaption: string; contactId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  const petitionerContactId = contactId;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER)) {
    throw new UnauthorizedError(
      'Unauthorized for removing petitioner from case',
    );
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
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
      applicationContext,
      authorizedUser,
      caseEntity,
      petitionerContactId,
    });

  caseEntity.removePetitioner(petitionerContactId);

  await applicationContext.getPersistenceGateway().deleteUserFromCase({
    applicationContext,
    docketNumber,
    userId: petitionerContactId,
  });

  caseEntity.caseCaption = caseCaption;

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  await deletePetitionerOnCase({
    contactId: petitionerContactId,
    docketNumber,
  });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

export const removePetitionerAndUpdateCaptionInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contactId,
    docketNumber,
  }: { caseCaption: string; contactId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  const lockId = hashLockId(`case|${docketNumber}`);

  return mutexLockWrapper({
    lockId,
    callback: () =>
      removePetitionerAndUpdateCaption(
        applicationContext,
        { caseCaption, contactId, docketNumber },
        authorizedUser,
      ),
  });
};

// export const removePetitionerAndUpdateCaptionInteractor = withLocking(
//   removePetitionerAndUpdateCaption,
//   (_applicationContext, { docketNumber }) => ({
//     identifiers: [`case|${docketNumber}`],
//   }),
// );
