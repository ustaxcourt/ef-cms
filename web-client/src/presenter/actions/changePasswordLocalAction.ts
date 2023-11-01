import { state } from '@web-client/presenter/app.cerebral';

/**
 * Updates the user's password in cognito, locally
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the cerebral path function
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const changePasswordLocalAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const { sessionId, userEmail } = get(state.login);
  const newPassword = get(state.form.newPassword);

  const response = await applicationContext
    .getUseCases()
    .changePasswordLocalInteractor(applicationContext, {
      newPassword,
      sessionId,
      userEmail,
    });

  if (response.AuthenticationResult) {
    return path.yes({
      alertSuccess: {
        message: 'Password successfully changed.',
      },
    });
  } else {
    return path.no();
  }
};
