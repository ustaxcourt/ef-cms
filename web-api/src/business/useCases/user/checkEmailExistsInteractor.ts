import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { UnauthorizedError } from '@web-api/errors/errors';
import { checkEmailExists } from '@web-api/persistence/postgres/users/checkEmailExists';

export const checkEmailExistsInteractor = async (
  { email }: { email: string },
  authorizedUser: UnknownAuthUser,
): Promise<boolean> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_PETITIONER_EMAIL)) {
    throw new UnauthorizedError('Unauthorized to get user emails');
  }

  const matchingEmails = await checkEmailExists({ email });

  return matchingEmails > 0;
};
