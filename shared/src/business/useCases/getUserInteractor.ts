import {
  IrsPractitioner,
  RawIrsPractitioner,
} from '../entities/IrsPractitioner';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { Practitioner, RawPractitioner } from '../entities/Practitioner';
import {
  PrivatePractitioner,
  RawPrivatePractitioner,
} from '../entities/PrivatePractitioner';
import { RawUser, User } from '../entities/User';
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

  if (user.entityName === PrivatePractitioner.ENTITY_NAME) {
    return new PrivatePractitioner(user).validate().toRawObject();
  } else if (user.entityName === IrsPractitioner.ENTITY_NAME) {
    return new IrsPractitioner(user).validate().toRawObject();
  } else if (user.entityName === Practitioner.ENTITY_NAME) {
    return new Practitioner(user).validate().toRawObject();
  } else {
    return new User(user).validate().toRawObject();
  }
};
