import { ROLES } from '../../entities/EntityConstants';

/**
 * createUserInteractorLocal
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createUserInteractorLocal = async (
  applicationContext: IApplicationContext,
  { user }: { user: { password: string; name: string; email: string } },
) => {
  const userId = applicationContext.getUniqueId();

  const params = {
    ClientId: 'bvjrggnd3co403c0aahscinne',
    Password: user.password,
    UserAttributes: [
      {
        Name: 'email',
        Value: user.email,
      },
      {
        Name: 'email_verified',
        Value: 'True',
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
    Username: userId,
  };

  return await applicationContext.getCognito().signUp(params).promise();
};
