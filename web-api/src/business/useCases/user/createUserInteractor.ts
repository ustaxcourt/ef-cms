import {
  Practitioner,
  RawPractitioner,
} from '../../../../../shared/src/business/entities/Practitioner';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import {
  RawUser,
  User,
} from '../../../../../shared/src/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '../../../errors/errors';
import { createPractitionerUser } from '../../../../../shared/src/business/utilities/createPractitionerUser';

export const createUserInteractor = async (
  applicationContext: ServerApplicationContext,
  { user }: { user: RawUser & { barNumber?: string; password: string } },
): Promise<RawUser | RawPractitioner> => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let userEntity: User;

  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    userEntity = new Practitioner(
      await createPractitionerUser({ applicationContext, user }),
    );
  } else {
    if (user.barNumber === '') {
      delete user.barNumber;
    }

    userEntity = new User({
      ...user,
      userId: applicationContext.getUniqueId(),
    });
  }

  const { userId } = await applicationContext
    .getPersistenceGateway()
    .createOrUpdateUser({
      applicationContext,
      password: user.password,
      user: userEntity.validate().toRawObject(),
    });

  if (user.role === ROLES.legacyJudge) {
    await applicationContext.getUserGateway().disableUser(applicationContext, {
      userId,
    });
  }

  userEntity.userId = userId;

  return userEntity.validate().toRawObject();
};
