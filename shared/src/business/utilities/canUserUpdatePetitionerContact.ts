import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  canAllowDocumentServiceForCase,
  getPractitionersRepresenting,
} from '@shared/business/entities/cases/Case';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const canUserUpdatePetitionerContact = ({
  petitionerCaseRaw,
  contactId,
  user,
}: {
  petitionerCaseRaw: RawCase;
  contactId: string;
  user: AuthUser;
}): boolean => {
  if (!canAllowDocumentServiceForCase(petitionerCaseRaw)) return false;

  let isRepresentingCounsel = false;
  if (user.role === ROLES.privatePractitioner) {
    const practitioners = getPractitionersRepresenting(
      petitionerCaseRaw,
      contactId,
    );

    isRepresentingCounsel = practitioners?.find(
      practitioner => practitioner.userId === user.userId,
    );
  }

  let isCurrentPetitioner = false;
  if (user.role === ROLES.petitioner) {
    const isContactOnCase = petitionerCaseRaw?.petitioners?.some(
      petitioner => petitioner.contactId === contactId,
    );
    isCurrentPetitioner = isContactOnCase && contactId === user.userId;
  }

  return (
    isRepresentingCounsel ||
    isCurrentPetitioner ||
    isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)
  );
};
