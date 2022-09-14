import { UpdateUserEmail } from '../entities/UpdateUserEmail';

/**
 * validateUpdateUserEmailInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.updateUserEmail the update user email form data
 * @returns {object} errors (null if no errors)
 */
export const validateUpdateUserEmailInteractor = (
  applicationContext: IApplicationContext,
  { updateUserEmail }: { updateUserEmail: any },
) => {
  const errors = new UpdateUserEmail(updateUserEmail, {
    applicationContext,
  }).getFormattedValidationErrors();
  return errors || null;
};
