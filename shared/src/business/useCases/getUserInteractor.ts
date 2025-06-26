import { RawIrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { RawPrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawUser } from '@shared/business/entities/User';
import {
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export type GetUserResponse =
  | RawUser
  | RawPractitioner
  | RawIrsPractitioner
  | RawPrivatePractitioner;

export const getUserInteractor = async (
  authorizedUser: UnknownAuthUser,
): Promise<GetUserResponse> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError('Not authorized to get user');
  }

  const user = await getUserById({
    userId: authorizedUser.userId,
  });

  if (!user) {
    throw new NotFoundError(
      `User id "${authorizedUser.userId}" not found in persistence.`,
    );
  }

  return user;
};
