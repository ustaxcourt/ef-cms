import { UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getUserByEmail } from '@web-api/gateways/user/getUserByEmail';
import { ROLES } from '@shared/business/entities/EntityConstants';

export const getRegStatusInteractor = async (
  applicationContext: ServerApplicationContext,
  { userEmail }: { userEmail: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError(`Invalid User`);
  }

  const user = await getUserByEmail(applicationContext, { email: userEmail });

  // get cases for user

  if (user?.role === ROLES.irsPractitioner || ROLES.privatePractitioner) {
    // get bar number for practitioner user
  }

  return user;
};
