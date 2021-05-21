import { state } from 'cerebral';

/**
 * validate the change login and service email form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context needed for getting the use case
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @returns {object} the next path based on if validation was successful or error
 */
export const validateChangeLoginAndServiceEmailAction = ({
  applicationContext,
  get,
  path,
}) => {
  const form = get(state.form);

  const errors = applicationContext
    .getUseCases()
    .validateUpdateUserEmailInteractor(applicationContext, {
      updateUserEmail: form,
    });

  if (!errors) {
    return path.success();
  } else {
    return path.error({
      errors,
    });
  }
};
