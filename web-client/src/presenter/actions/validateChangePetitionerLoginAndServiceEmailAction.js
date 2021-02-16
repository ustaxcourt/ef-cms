import { state } from 'cerebral';

/**
 * validate the change petitioner login and service email form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateChangePetitionerLoginAndServiceEmailAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { contactPrimary, contactSecondary } = get(state.form);
  let errorsContactSecondary;

  const errorsContactPrimary = applicationContext
    .getUseCases()
    .validateUpdateUserEmailInteractor({
      applicationContext,
      updateUserEmail: contactPrimary,
    });

  if (
    contactSecondary &&
    contactSecondary.email &&
    contactSecondary.confirmEmail
  ) {
    errorsContactSecondary = applicationContext
      .getUseCases()
      .validateUpdateUserEmailInteractor({
        applicationContext,
        updateUserEmail: contactSecondary,
      });
  }

  const hasErrors = !!errorsContactPrimary || !!errorsContactSecondary;

  if (hasErrors) {
    return path.error({
      errors: {
        contactPrimary: errorsContactPrimary,
        contactSecondary: errorsContactSecondary,
      },
    });
  } else {
    return path.success();
  }
};
