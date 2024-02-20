import { state } from '@web-client/presenter/app.cerebral';

/**
 * check if the email is already in use
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path function
 * @returns {object} continue path for the sequence
 */
export const checkEmailAvailabilityForPetitionerAction = async ({
  applicationContext,
  get,
  path,
}: ActionProps) => {
  const { updatedEmail } = get(state.form.contact);

  const { isAccountConfirmed, isEmailAvailable } = await applicationContext
    .getUseCases()
    .checkEmailAvailabilityInteractor(applicationContext, {
      email: updatedEmail,
    });

  if (isEmailAvailable) {
    return path.emailAvailable();
  } else {
    if (!isAccountConfirmed) {
      return path.accountIsUnconfirmed({
        errors: {
          email:
            'An account with this email already exists but is not confirmed. Please contact the user and ask them to verify their account.',
        },
      });
    }

    return path.emailInUse({
      errors: {
        email:
          'An account with this email already exists. Enter a new email address.',
      },
    });
  }
};
