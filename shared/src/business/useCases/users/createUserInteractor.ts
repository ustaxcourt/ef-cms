import { createPractitionerUser } from '../../utilities/createPractitionerUser';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { Practitioner } from '../../entities/Practitioner';
import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';
import { User } from '../../entities/User';

/**
 * createUserInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createUserInteractor = async (
  applicationContext: IApplicationContext,
  { user }: { user: TUser & { barNumber: string; password: string } },
) => {
  const requestUser = applicationContext.getCurrentUser();

  if (!isAuthorized(requestUser, ROLE_PERMISSIONS.CREATE_USER)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let userEntity = null;

  if (
    [
      ROLES.privatePractitioner,
      ROLES.irsPractitioner,
      ROLES.inactivePractitioner,
    ].includes(user.role)
  ) {
    userEntity = new Practitioner(
      await createPractitionerUser({ applicationContext, user }),
    );
  } else {
    if (user.barNumber === '') {
      delete user.barNumber;
    }
    userEntity = new User(
      { ...user, userId: applicationContext.getUniqueId() },
      { applicationContext },
    );
  }

  const { userId } = await applicationContext
    .getPersistenceGateway()
    .createOrUpdateUser({
      applicationContext,
      disableCognitoUser: user.role === ROLES.legacyJudge,
      password: user.password,
      user: userEntity.validate().toRawObject(),
    });

  userEntity.userId = userId;

  return userEntity.validate().toRawObject();
};
