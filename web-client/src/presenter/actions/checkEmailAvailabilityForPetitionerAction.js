import { state } from 'cerebral';

/**
 * check if the email is already in use
 *
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
}) => {
  const { updatedEmail } = get(state.form.contact);

  const isEmailAvailable = await applicationContext
    .getUseCases()
    .checkEmailAvailabilityInteractor(applicationContext, {
      email: updatedEmail,
    });

  return isEmailAvailable
    ? path.emailAvailable()
    : path.emailInUse({
        errors: {
          email:
            'An account with this email already exists. Enter a new email address.',
        },
      });
};
