import { state } from '@web-client/presenter/app.cerebral';

/**
 * updates the user's pendingEmail attribute which will send out a verify email
 * @param {object} props.applicationContext the applicationContext
 * @param {function} props.get the cerebral get function
 * @returns {object} containing updated user information to props
 */
export const updateUserPendingEmailAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps<{ pendingEmail?: string }>) => {
  const pendingEmail = props.pendingEmail || get(state.form.email);

  const updatedUser = await applicationContext
    .getUseCases()
    .updateUserPendingEmailInteractor(applicationContext, {
      pendingEmail,
    });

  return { user: updatedUser };
};
