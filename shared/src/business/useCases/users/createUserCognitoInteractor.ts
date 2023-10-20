import { ROLES } from '../../entities/EntityConstants';

/**
 * createUserCognitoInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.user the user data
 * @returns {Promise} the promise of the createUser call
 */
export const createUserCognitoInteractor = async (
  applicationContext: IApplicationContext,
  { user }: { user: { password: string; name: string; email: string } },
) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
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
    ],
    Username: user.email,
  };

  return await applicationContext.getCognito().signUp(params).promise();
};
