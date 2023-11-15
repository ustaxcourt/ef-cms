import { post } from '../requests';

/**
 * confirmSignUpLocalInteractor
 * @param {object} applicationContext the application context
 * @param {object} auth an object
 * @param {string} auth.confirmationCode the email confirmation code provided by cognito
 * @param {string} auth.userEmail the email of the user confirming their account
 * @returns {Promise<*>} the promise of the api call
 */
export const confirmSignUpLocalInteractor = (
  applicationContext,
  { confirmationCode, userEmail },
) => {
  return post({
    applicationContext,
    body: { confirmationCode, userEmail },
    endpoint: '/confirm-signup-local',
    options: {
      withCredentials: false,
    },
  });
};
