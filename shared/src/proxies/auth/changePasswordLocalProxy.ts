import { post } from '../requests';

/**
 * changePasswordLocalInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} auth the auth object
 * @param {string} auth.newPassword the new password provided by a local user
 * @param {string} auth.sessionId the cognito (local) session id
 * @param {string} auth.userEmail the email of the user changing passwords
 * @returns {Promise<*>} the promise of the api call
 */
exports.changePasswordLocalInteractor = (
  applicationContext,
  { newPassword, sessionId, userEmail },
) => {
  return post({
    applicationContext,
    body: { newPassword, sessionId, userEmail },
    endpoint: '/change-password-local',
    options: {
      withCredentials: false,
    },
  });
};
