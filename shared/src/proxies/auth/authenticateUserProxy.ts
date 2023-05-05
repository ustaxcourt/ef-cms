import { post } from '../requests';

/**
 * authenticateUserInteractor
 * @param {object} applicationContext the application context
 * @param {object} auth the auth object
 * @param {object} auth.code the OAuth2 authorization code
 * @returns {Promise<*>} the promise of the api call
 */
export const authenticateUserInteractor = (
  applicationContext,
  { code, cognitoLocal },
) => {
  return post({
    applicationContext,
    body: { code, cognitoLocal },
    endpoint: '/auth/login',
    options: {
      withCredentials: true,
    },
  });
};
