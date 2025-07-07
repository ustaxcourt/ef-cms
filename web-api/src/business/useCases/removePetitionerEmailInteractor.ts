import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  Petitioner,
  RawPetitioner,
} from '@shared/business/entities/contacts/Petitioner';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { disassociateUsersFromCases } from '@web-api/persistence/postgres/cases/userOnCase/disassociateUsersFromCases';

export const removePetitionerEmailInteractor = async (
  { docketNumber, email }: { docketNumber: string; email: string },
  authorizedUser: UnknownAuthUser,
): Promise<RawPetitioner> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER_EMAIL)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const rawCase = await getCaseByDocketNumber({
    docketNumber,
    includeConsolidatedCases: false,
  });

  const petitionerToRemove = rawCase.petitioners.find(
    petitioner => petitioner.email === email,
  );

  if (!petitionerToRemove) {
    throw new Error(`Petitioner with email ${email} not found`);
  }

  const oldContactId = petitionerToRemove.contactId;

  const caseEntity = new Case(rawCase, { authorizedUser });

  const updatedPetitioner = caseEntity.updatePetitioner({
    updatedPetitioner: {
      ...petitionerToRemove,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      hasElectronicAccess: false,
      email: undefined,
    },
    assignNewId: true,
  });

  const caseToUpdate = caseEntity.validate().toRawObject();

  // TODO 10495: This will be a problem when petitioners are moved over to dwUser table as disassociateUsersFromCases will totally remove the petitioner from a case, not just their access to the case.
  await settlePromises([
    upsertCases([caseToUpdate]),
    disassociateUsersFromCases([
      {
        docketNumber,
        userId: oldContactId,
      },
    ]),
  ]);

  return new Petitioner(updatedPetitioner).toRawObject();
};
