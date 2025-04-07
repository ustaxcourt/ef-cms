import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getPetitionersOnCase } from '@web-api/persistence/postgres/cases/parties/getPetitionersOnCase';
import { getUniqueId } from '@shared/sharedAppContext';
import { updatePetitionerOnCase } from '@web-api/persistence/postgres/cases/parties/updatePetitionerOnCase';
import { Petitioner } from '@shared/business/entities/contacts/Petitioner';

export const removePetitionerEmailInteractor = async (
  { docketNumber, email }: { docketNumber: string; email: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.REMOVE_PETITIONER_EMAIL)) {
    throw new UnauthorizedError('Unauthorized');
  }
  const petitioners = await getPetitionersOnCase({ docketNumber });
  const petitionerToRemove = petitioners.find(
    petitioner => petitioner.email === email,
  );
  if (!petitionerToRemove) {
    throw new Error(`Petitioner with email ${email} not found`);
  }

  const updatedPetitioner = new Petitioner({
    ...petitionerToRemove,
    email: null,
    hasElectronicAccess: false,
    serviceIndicator: 'Paper',
    contactId: getUniqueId(),
  });

  await updatePetitionerOnCase({
    docketNumber,
    petitioner: updatedPetitioner,
    oldContactId: petitionerToRemove.contactId,
  });
};
