import { RawIrsPractitioner } from '../entities/IrsPractitioner';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { RawPractitioner } from '../entities/Practitioner';
import { RawPrivatePractitioner } from '../entities/PrivatePractitioner';
import { RawUser } from '../entities/User';
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
  _: IApplicationContext,
  authorizedUser: UnknownAuthUser,
): Promise<GetUserResponse> => {
  if (!isAuthUser(authorizedUser)) {
    throw new UnauthorizedError('Not authorized to get user');
  }

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User id "${authorizedUser.userId}" not found in persistence.`,
    );
  }

  return user;
};
