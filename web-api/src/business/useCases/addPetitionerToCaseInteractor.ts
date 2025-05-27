import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const addPetitionerToCase = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaption,
    contact,
    docketNumber,
  }: { caseCaption: string; contact: any; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawCase> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.ADD_PETITIONER_TO_CASE)) {
    throw new UnauthorizedError('Unauthorized for adding petitioner to case');
  }

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  if (caseEntity.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${docketNumber} has not been served`,
    );
  }

  caseEntity.caseCaption = caseCaption;

  const petitionerEntity = new Petitioner(contact);

  caseEntity.addPetitioner(petitionerEntity);

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).validate().toRawObject();
};

// export const addPetitionerToCaseInteractor = async (
//   applicationContext: ServerApplicationContext,
//   {
//     caseCaption,
//     contact,
//     docketNumber,
//   }: { caseCaption: string; contact: any; docketNumber: string },
//   authorizedUser: UnknownAuthUser,
// ) => {
//   const lockId = hashLockId(`case|${docketNumber}`);

//   return mutexLockWrapper({
//     lockId,
//     callback: () =>
//       addPetitionerToCase(
//         applicationContext,
//         { caseCaption, contact, docketNumber },
//         authorizedUser,
//       ),
//   });
// };

export const addPetitionerToCaseInteractor = withLocking(
  addPetitionerToCase,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
