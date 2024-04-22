import { ROLES } from '../../entities/EntityConstants';
import { User } from '../../entities/User';

/**
 * createPetitionerAccountInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createPetitionerAccountInteractor = async (
  applicationContext: IApplicationContext,
  { email, name, userId }: { email: string; name: string; userId: string },
) => {
  const userEntity = new User({
    email,
    name,
    role: ROLES.petitioner,
    userId,
  });

  await applicationContext.getPersistenceGateway().persistUser({
    applicationContext,
    user: userEntity.validate().toRawObject(),
  });

  return userEntity.validate().toRawObject();
};
