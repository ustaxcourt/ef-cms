/**
 * Confirms the user's account in cognito, locally
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
}: ActionProps) => {
  const { confirmationCode, userEmail } = props;

  try {
    await applicationContext
      .getUseCases()
      .confirmSignUpLocalInteractor(applicationContext, {
        confirmationCode,
        userEmail,
      });
    return path.yes({
      alertSuccess: {
        alertType: 'success',
        message:
          'Your registration has been confirmed! You will be redirected shortly!',
        title: 'Account Confirmed Locally',
      },
    });
  } catch (e) {
    return path.no({
      alertError: {
        message: 'Error confirming account',
      },
    });
  }
};
