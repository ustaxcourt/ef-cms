import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import { checkEmailIsPractitioner } from '@web-api/persistence/postgres/users/checkEmailIsPractitioner';

export const checkEmailIsPetitionerInteractor = async (
  { email }: { email: string },
  authorizedUser: UnknownAuthUser,
): Promise<boolean> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_PETITIONER_EMAIL)) {
    throw new UnauthorizedError('Unauthorized to get user emails');
  }

  const matchingEmails = await checkEmailIsPractitioner({ email });

  return matchingEmails;
};
