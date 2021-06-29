import { state } from 'cerebral';

/**
 * updates the user's pendingEmail attribute which will send out a verify email
 *
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 * @returns {object} containing updated user information to props
 */
export const updateUserPendingEmailAction = async ({
  applicationContext,
  get,
}) => {
  const { email: pendingEmail } = get(state.form);

  const updatedUser = await applicationContext
    .getUseCases()
    .updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

  return { user: updatedUser };
};
