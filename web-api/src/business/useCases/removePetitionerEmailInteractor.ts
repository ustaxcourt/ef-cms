import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
// import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { getUniqueId } from '@shared/sharedAppContext';
import { updatePetitionerOnCase } from '@web-api/persistence/postgres/cases/parties/updatePetitionerOnCase';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';
import { upsertPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/upsertPetitionersOnCase';
import { Case } from '@shared/business/entities/cases/Case';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { applicationContext } from '@web-api/applicationContext';

export const removePetitionerEmailInteractor = async (
  { docketNumber, email }: { docketNumber: string; email: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER_EMAIL)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const case1 = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });

  // const petitioners = await getPetitionersOnCase({ docketNumber });
  // const petitionerToRemove = petitioners.find(
  //   petitioner => petitioner.email === email,
  // );
  // if (!petitionerToRemove) {
  //   throw new Error(`Petitioner with email ${email} not found`);
  // }

  // const updatedPetitioner = new Petitioner({
  //   ...petitionerToRemove,
  //   email: null,
  //   hasElectronicAccess: false,
  //   serviceIndicator: 'Paper',
  //   // contactId: getUniqueId(),
  // });

  const petitionerToRemove = case1.petitioners.find(
    petitioner => petitioner.email === email,
  );

  if (!petitionerToRemove) {
    throw new Error(`Petitioner with email ${email} not found`);
  }

  petitionerToRemove.serviceIndicator = 'Paper';
  petitionerToRemove.hasElectronicAccess = false;
  delete petitionerToRemove.email;

  const caseToUpdate = new Case(case1, { authorizedUser })
    .validate()
    .toRawObject();

  await upsertPetitionersOnCase({
    docketNumber,
    petitionerCase: caseToUpdate,
  });

  const petitionerToUpdate = new Petitioner({
    ...petitionerToRemove,
    contactId: getUniqueId(),
  });

  await updatePetitionerOnCase({
    docketNumber,
    petitioner: petitionerToUpdate,
    oldContactId: petitionerToRemove.contactId,
  });
};
