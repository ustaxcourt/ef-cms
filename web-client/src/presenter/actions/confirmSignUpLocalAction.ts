/**
 * Confirms the user's account in cognito, locally
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.path the cerebral path function
 * @param {object} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const confirmSignUpLocalAction = async ({
  applicationContext,
  path,
  props,
}) => {
  const { confirmationCode, userEmail } = props;

  const response = await applicationContext
    .getUseCases()
    .confirmSignUpLocalInteractor(applicationContext, {
      confirmationCode,
      userEmail,
    });

  if (response) {
    return path.yes({
      alertSuccess: {
        message: 'Your registration has been confirmed!',
      },
    });
  } else {
    return path.no({
      alertError: {
        message: 'Error confirming account',
      },
    });
  }
};
