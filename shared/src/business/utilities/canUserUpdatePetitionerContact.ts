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
  updatedPetitionerData,
  user,
}: {
  petitionerCaseRaw: RawCase;
  updatedPetitionerData: any;
  user: AuthUser;
}) => {
  if (!canAllowDocumentServiceForCase(petitionerCaseRaw)) return false;

  let isRepresentingCounsel = false;
  if (user.role === ROLES.privatePractitioner) {
    const practitioners = getPractitionersRepresenting(
      petitionerCaseRaw,
      updatedPetitionerData?.contactId,
    );

    isRepresentingCounsel = practitioners?.find(
      practitioner => practitioner.userId === user.userId,
    );
  }

  let isCurrentPetitioner = false;
  if (user.role === ROLES.petitioner) {
    isCurrentPetitioner = updatedPetitionerData?.contactId === user.userId;
  }

  return (
    isRepresentingCounsel ||
    isCurrentPetitioner ||
    isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)
  );
};
