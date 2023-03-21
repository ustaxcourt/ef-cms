import { ROLES } from '../../entities/EntityConstants';
import { createUserRecords } from '../../../persistence/dynamo/users/createNewPetitionerUser';

/**
 * createUserInteractorLocal
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createUserInteractorLocal = async (
  applicationContext,
  { user },
) => {
  const userId = applicationContext.getUniqueId();

  const baseCreateUserParams = {
    DesiredDeliveryMediums: ['EMAIL'],
    TemporaryPassword: user.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'custom:role',
        Value: ROLES.petitioner,
      },
      {
        Name: 'name',
        Value: user.name,
      },
      {
        Name: 'custom:userId',
        Value: userId,
      },
    ],
    UserPoolId: process.env.USER_POOL_ID,
    Username: user.email,
  };

  await applicationContext
    .getCognito()
    .adminCreateUser(baseCreateUserParams)
    .promise();

  delete user.password;

  const newUser = await createUserRecords({
    applicationContext,
    newUser: {
      ...user,
      role: 'petitioner',
      section: 'petitioner',
    },
    userId,
  });

  return newUser;
};
